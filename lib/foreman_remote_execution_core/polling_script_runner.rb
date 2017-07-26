module ForemanRemoteExecutionCore
  class PollingScriptRunner < ScriptRunner

    def initialize(options = {})
      super(options)
      @callback_host = options[:callback_host]
      @task_id = options[:uuid]
      @step_id = options[:step_id]
      @otp = ForemanTasksCore::OtpManager.generate_otp(@uuid)
    end

    def prepare_start
      super
      basedir         = File.dirname @remote_script
      @pid_path       = File.join(basedir, 'pid')
      @retrieval_script ||= File.join(basedir, 'retrieve')
      prepare_retrieval unless @prepared
    end

    def control_script
      close_stdin = '</dev/null'
      close_fds = close_stdin + ' >/dev/null 2>/dev/null'
      # pipe the output to tee while capturing the exit code in a file, don't wait for it to finish, output PID of the main command
      <<-SCRIPT.gsub(/^\s+\| /, '')
      | sh -c '(#{su_prefix}#{@remote_script} #{close_stdin}; echo $?>#{@exit_code_path}) | /usr/bin/tee #{@output_path} >/dev/null; #{callback_scriptlet}' #{close_fds} &
      | echo $! > '#{@pid_path}'
      SCRIPT
    end

    def trigger(*args)
      run_sync(*args)
    end

    def refresh
      err = output = nil
      with_retries do
        _, output, err = run_sync("#{su_prefix} #{@retrieval_script}")
      end
      lines = output.lines
      result = lines.shift.match(/^DONE (\d+)?/)
      publish_data(lines.join, 'stdout') unless lines.empty?
      publish_data(err, 'stderr') unless err.empty?
      if result
        exitcode = result[1] || 0
        publish_exit_status(exitcode.to_i)
      end
      destroy_session
    end

    def close
      super
      ForemanTasksCore::OtpManager.drop_otp(@uuid, @otp) if @otp
    end

    def prepare_retrieval
      # The script always outputs at least one line
      # First line of the output either has to begin with
      # "RUNNING" or "DONE $EXITCODE"
      # The following lines are treated as regular output
      base = File.dirname(@output_path)
      posfile = File.join(base, 'position')
      tmpfile = File.join(base, 'tmp')
      script = <<-SCRIPT.gsub(/^ +\| /, '')
      | #!/bin/sh
      | pid=$(cat "#{@pid_path}")
      | if ! pgrep --help 2>/dev/null >/dev/null; then
      |   echo DONE 1
      |   echo "pgrep is required" >&2
      |   exit 1
      | fi
      | if pgrep -P "$pid" >/dev/null 2>/dev/null; then
      |   echo RUNNING
      | else
      |   echo "DONE $(cat "#{@exit_code_path}" 2>/dev/null)"
      | fi
      | [ -f "#{@output_path}" ] || exit 0
      | [ -f "#{posfile}" ] || echo 1 > "#{posfile}"
      | position=$(cat "#{posfile}")
      | tail --bytes "+${position}" "#{@output_path}" > "#{tmpfile}"
      | bytes=$(cat "#{tmpfile}" | wc --bytes)
      | expr "${position}" + "${bytes}" > "#{posfile}"
      | cat "#{tmpfile}"
      SCRIPT
      @logger.debug("copying script:\n#{script.lines.map { |line| "    | #{line}" }.join}")
      cp_script_to_remote(script, 'retrieve')
      @prepared = true
    end

    def callback_scriptlet(callback_script_path = nil)
      if @otp
        callback_script_path = cp_script_to_remote(callback_script, 'callback') if callback_script_path.nil?
        "#{su_prefix}#{callback_script_path}"
      else
        ':' # Shell synonym for "do nothing"
      end
    end

    def callback_script
      <<-SCRIPT.gsub(/^ +\| /, '')
      | #!/bin/sh
      | exit_code=$(cat "#{@exit_code_path}")
      | url="#{@callback_host}/dynflow/tasks/#{@task_id}/done"
      | json="{ \\\"step_id\\\": #{@step_id} }"
      | if which curl >/dev/null; then
      |   curl -X POST -d "$json" -u "#{@task_id}:#{@otp}" "$url"
      | else
      |   echo 'curl is required' >&2
      |   exit 1
      | fi
      SCRIPT
    end

    private

    def destroy_session
      if @session
        @logger.debug("Closing session with #{@ssh_user}@#{@host}")
        @session.close
        @session = nil
      end
    end
  end
end
