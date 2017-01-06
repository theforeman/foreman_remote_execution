require 'net/ssh'
require 'net/scp'

module ForemanRemoteExecutionCore
  class ScriptRunner < ForemanTasksCore::Runner::Base
    EXPECTED_POWER_ACTION_MESSAGES = ["restart host", "shutdown host"]

    def initialize(options)
      super()
      @host = options.fetch(:hostname)
      @script = options.fetch(:script)
      @ssh_user = options.fetch(:ssh_user, 'root')
      @ssh_port = options.fetch(:ssh_port, 22)
      @effective_user = options.fetch(:effective_user, nil)
      @effective_user_method = options.fetch(:effective_user_method, 'sudo')
      @host_public_key = options.fetch(:host_public_key, nil)
      @verify_host = options.fetch(:verify_host, nil)

      @client_private_key_file = settings.fetch(:ssh_identity_key_file)
      @local_working_dir = options.fetch(:local_working_dir, settings.fetch(:local_working_dir))
      @remote_working_dir = options.fetch(:remote_working_dir, settings.fetch(:remote_working_dir))
    end

    def start
      remote_script = cp_script_to_remote
      output_path = File.join(File.dirname(remote_script), 'output')
      exit_code_path = File.join(File.dirname(remote_script), 'exit_code')

      # pipe the output to tee while capturing the exit code in a file
      script = <<-SCRIPT
          (#{su_prefix}#{remote_script}; echo $?>#{exit_code_path}) | /usr/bin/tee #{output_path}
          exit $(< #{exit_code_path})
      SCRIPT

      logger.debug("executing script:\n#{script.lines.map { |line| "  | #{line}" }.join}")
      run_async(script)
    rescue => e
      logger.error("error while initalizing command #{e.class} #{e.message}:\n #{e.backtrace.join("\n")}")
      publish_exception("Error initializing command", e)
    end

    def refresh
      return if @session.nil?
      with_retries do
        with_disconnect_handling do
          @session.process(0)
        end
      end
    ensure
      check_expecting_disconnect
    end

    def kill
      if @session
        run_sync("pkill -f #{remote_command_file('script')}")
      else
        logger.debug("connection closed")
      end
    rescue => e
      publish_exception("Unexpected error", e, false)
    end

    def with_retries
      tries = 0
      begin
        yield
      rescue => e
        logger.error("Unexpected error: #{e.class} #{e.message}\n #{e.backtrace.join("\n")}")
        tries += 1
        if tries <= MAX_PROCESS_RETRIES
          logger.error('Retrying')
          retry
        else
          publish_exception("Unexpected error", e)
        end
      end
    end

    def with_disconnect_handling
      yield
    rescue Net::SSH::Disconnect => e
      @session.shutdown!
      check_expecting_disconnect
      if @expecting_disconnect
        publish_exit_status(0)
      else
        publish_exception("Unexpected disconnect", e)
      end
    end

    def close
      @session.close if @session && !@session.closed?
    end

    private

    def session
      @session ||= begin
                     @logger.debug("opening session to #{@ssh_user}@#{@host}")
                     Net::SSH.start(@host, @ssh_user, ssh_options)
                   end
    end

    def ssh_options
      ssh_options = {}
      ssh_options[:port] = @ssh_port if @ssh_port
      ssh_options[:keys] = [@client_private_key_file] if @client_private_key_file
      ssh_options[:user_known_hosts_file] = @known_hosts_file if @known_hosts_file
      ssh_options[:keys_only] = true
      # if the host public key is contained in the known_hosts_file,
      # verify it, otherwise, if missing, import it and continue
      ssh_options[:paranoid] = true
      ssh_options[:auth_methods] = ["publickey"]
      ssh_options[:user_known_hosts_file] = prepare_known_hosts if @host_public_key
      return ssh_options
    end

    def settings
      ForemanRemoteExecutionCore.settings
    end

    # Initiates run of the remote command and yields the data when
    # available. The yielding doesn't happen automatically, but as
    # part of calling the `refresh` method.
    def run_async(command)
      raise "Async command already in progress" if @started
      @started = false
      session.open_channel do |channel|
        channel.request_pty
        channel.on_data { |ch, data| publish_data(data, 'stdout') }
        channel.on_extended_data { |ch, type, data| publish_data(data, 'stderr') }
        # standard exit of the command
        channel.on_request("exit-status") { |ch, data| publish_exit_status(data.read_long) }
        # on signal: sending the signal value (such as 'TERM')
        channel.on_request("exit-signal") do |ch, data|
          publish_exit_status(data.read_string)
          ch.close
          # wait for the channel to finish so that we know at the end
          # that the session is inactive
          ch.wait
        end
        channel.exec(command) do |ch, success|
          @started = true
          raise("Error initializing command") unless success
        end
      end
      session.process(0) until @started
      return true
    end

    def run_sync(command)
      output = ""
      exit_status = nil
      channel = session.open_channel do |ch|
        ch.on_data { |_, data| output.concat(data) }
        ch.on_extended_data { |_, _, data| output.concat(data) }
        ch.on_request("exit-status") { |_, data| exit_status = data.read_long }
        # on signal: sending the signal value (such as 'TERM')
        ch.on_request("exit-signal") do |_, data|
          exit_status = data.read_string
          ch.close
          ch.wait
        end
        ch.exec command do |_, success|
          raise "could not execute command" unless success
        end
      end
      channel.wait
      return exit_status, output
    end

    def su_prefix
      return if @effective_user.nil? || @effective_user == @ssh_user
      case @effective_user_method
      when 'sudo'
        "sudo -n -u #{@effective_user} "
      when 'su'
        "su - #{@effective_user} -c "
      else
        raise "effective_user_method ''#{@effective_user_method}'' not supported"
      end
    end

    def prepare_known_hosts
      path = local_command_file('known_hosts')
      if @host_public_key
        write_command_file_locally('known_hosts', "#{@host} #{@host_public_key}")
      end
      return path
    end

    def local_command_dir
      File.join(@local_working_dir, 'foreman-proxy', "foreman-ssh-cmd-#{@id}")
    end

    def local_command_file(filename)
      File.join(local_command_dir, filename)
    end

    def remote_command_dir
      File.join(@remote_working_dir, "foreman-ssh-cmd-#{id}")
    end

    def remote_command_file(filename)
      File.join(remote_command_dir, filename)
    end

    def ensure_local_directory(path)
      if File.exist?(path)
        raise "#{path} expected to be a directory" unless File.directory?(path)
      else
        FileUtils.mkdir_p(path)
      end
      return path
    end

    def cp_script_to_remote
      local_script_file = write_command_file_locally('script', sanitize_script(@script))
      File.chmod(0555, local_script_file)
      remote_script_file = remote_command_file('script')
      upload_file(local_script_file, remote_script_file)
      return remote_script_file
    end

    def upload_file(local_path, remote_path)
      ensure_remote_directory(File.dirname(remote_path))
      scp = Net::SCP.new(session)
      upload_channel = scp.upload(local_path, remote_path)
      upload_channel.wait
    ensure
      if upload_channel
        upload_channel.close
        upload_channel.wait
      end
    end

    def ensure_remote_directory(path)
      exit_code, output = run_sync("mkdir -p #{path}")
      if exit_code != 0
        raise "Unable to create directory on remote system #{path}: exit code: #{exit_code}\n #{output}"
      end
    end

    def sanitize_script(script)
      script.tr("\r", '')
    end

    def write_command_file_locally(filename, content)
      path = local_command_file(filename)
      ensure_local_directory(File.dirname(path))
      File.write(path, content)
      return path
    end

    # when a remote server disconnects, it's hard to tell if it was on purpose (when calling reboot)
    # or it's an error. When it's expected, we expect the script to produce 'restart host' as
    # its last command output
    def check_expecting_disconnect
      last_output = @continuous_output.raw_outputs.find { |d| d['output_type'] == 'stdout' }
      return unless last_output
      if EXPECTED_POWER_ACTION_MESSAGES.any? { |message| last_output['output'] =~ /^#{message}/ }
        @expecting_disconnect = true
      end
    end
  end
end
