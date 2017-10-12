require 'net/ssh'

# rubocop:disable Lint/HandleExceptions
begin
  require 'net/ssh/krb'
rescue LoadError; end
# rubocop:enable Lint/HandleExceptions:

module ForemanRemoteExecutionCore
  class ScriptRunner < ForemanTasksCore::Runner::Base
    attr_reader :execution_timeout_interval

    EXPECTED_POWER_ACTION_MESSAGES = ['restart host', 'shutdown host'].freeze
    DEFAULT_REFRESH_INTERVAL = 1
    MAX_PROCESS_RETRIES = 4

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
      @execution_timeout_interval = options.fetch(:execution_timeout_interval, nil)

      @client_private_key_file = settings.fetch(:ssh_identity_key_file)
      @local_working_dir = options.fetch(:local_working_dir, settings.fetch(:local_working_dir))
      @remote_working_dir = options.fetch(:remote_working_dir, settings.fetch(:remote_working_dir))
    end

    def start
      prepare_start
      script = control_script
      logger.debug("executing script:\n#{script.lines.map { |line| "  | #{line}" }.join}")
      trigger(script)
    rescue => e
      logger.error("error while initalizing command #{e.class} #{e.message}:\n #{e.backtrace.join("\n")}")
      publish_exception('Error initializing command', e)
    end

    def trigger(*args)
      run_async(*args)
    end

    def prepare_start
      @remote_script = cp_script_to_remote
      @output_path = File.join(File.dirname(@remote_script), 'output')
      @exit_code_path = File.join(File.dirname(@remote_script), 'exit_code')
    end

    def control_script
      # pipe the output to tee while capturing the exit code in a file
      <<-SCRIPT.gsub(/^\s+\| /, '')
      | sh <<WRAPPER
      | (#{su_prefix}#{@remote_script} < /dev/null; echo \\$?>#{@exit_code_path}) | /usr/bin/tee #{@output_path}
      | exit \\$(cat #{@exit_code_path})
      | WRAPPER
      SCRIPT
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
        logger.debug('connection closed')
      end
    rescue => e
      publish_exception('Unexpected error', e, false)
    end

    def timeout
      @logger.debug('job timed out')
      super
    end

    def timeout_interval
      execution_timeout_interval
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
          publish_exception('Unexpected error', e)
        end
      end
    end

    def with_disconnect_handling
      yield
    rescue IOError, Net::SSH::Disconnect => e
      @session.shutdown!
      check_expecting_disconnect
      if @expecting_disconnect
        publish_exit_status(0)
      else
        publish_exception('Unexpected disconnect', e)
      end
    end

    def close
      @session.close if @session && !@session.closed?
    end

    def publish_data(data, type)
      super(data.force_encoding('UTF-8'), type)
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
      ssh_options[:auth_methods] = available_authentication_methods
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
      raise 'Async command already in progress' if @started
      @started = false
      session.open_channel do |channel|
        channel.request_pty
        channel.on_data { |ch, data| publish_data(data, 'stdout') }
        channel.on_extended_data { |ch, type, data| publish_data(data, 'stderr') }
        # standard exit of the command
        channel.on_request('exit-status') { |ch, data| publish_exit_status(data.read_long) }
        # on signal: sending the signal value (such as 'TERM')
        channel.on_request('exit-signal') do |ch, data|
          publish_exit_status(data.read_string)
          ch.close
          # wait for the channel to finish so that we know at the end
          # that the session is inactive
          ch.wait
        end
        channel.exec(command) do |ch, success|
          @started = true
          raise('Error initializing command') unless success
        end
      end
      session.process(0) until @started
      return true
    end

    def run_sync(command, stdin = nil)
      stdout = ''
      stderr = ''
      exit_status = nil
      started = false

      channel = session.open_channel do |ch|
        ch.on_data { |_, data| stdout.concat(data) }
        ch.on_extended_data { |_, _, data| stderr.concat(data) }
        ch.on_request('exit-status') { |_, data| exit_status = data.read_long }
        # Send data to stdin if we have some
        ch.send_data(stdin) unless stdin.nil?
        # on signal: sending the signal value (such as 'TERM')
        ch.on_request('exit-signal') do |_, data|
          exit_status = data.read_string
          ch.close
          ch.wait
        end
        ch.exec command do |_, success|
          raise 'could not execute command' unless success
          started = true
        end
      end
      session.process(0) until started
      # Closing the channel without sending any data gives us SIGPIPE
      channel.close unless stdin.nil?
      channel.wait
      return exit_status, stdout, stderr
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

    def cp_script_to_remote(script = @script, name = 'script')
      upload_data(sanitize_script(script), remote_command_file(name), 555)
    end

    def upload_data(data, path, permissions = 555)
      ensure_remote_directory File.dirname(path)
      # We use tee here to pipe stdin coming from ssh to a file at $path, while silencing its output
      # This is used to write to $path with elevated permissions, solutions using cat and output redirection
      # would not work, because the redirection would happen in the non-elevated shell.
      command = "tee '#{path}' >/dev/null && chmod '#{permissions}' '#{path}'"

      @logger.debug("Sending data to #{path} on remote host:\n#{data}")
      status, _out, err = run_sync(command, data)

      @logger.warn("Output on stderr while uploading #{path}:\n#{err}") unless err.empty?
      if status != 0
        raise "Unable to upload file to #{path} on remote system: exit code: #{status}"
      end
      path
    end

    def upload_file(local_path, remote_path)
      mode = File.stat(local_path).mode.to_s(8)[-3..-1]
      @logger.debug('Uploading local file: #{local_path} as #{remote_path} with #{mode} permissions')
      upload_data(File.read(local_path), remote_path, mode)
    end

    def ensure_remote_directory(path)
      exit_code, _output, err = run_sync("mkdir -p #{path}")
      if exit_code != 0
        raise "Unable to create directory on remote system #{path}: exit code: #{exit_code}\n #{err}"
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

    def available_authentication_methods
      methods = %w(publickey) # Always use pubkey auth as fallback
      if settings[:kerberos_auth]
        if defined? Net::SSH::Kerberos
          methods << 'gssapi-with-mic'
        else
          @logger.warn('Kerberos authentication requested but not available')
        end
      end
      methods
    end
  end
end
