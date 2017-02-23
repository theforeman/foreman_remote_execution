module ForemanRemoteExecutionCore
  class ScriptRunner < ForemanTasksCore::Runner::Base

    @@data = []

    def initialize(*args)
      super
      # Load the fake output the first time its needed
      unless @@data.frozen?
        logger.debug("Loading fake output file #{configuration_path}")
        File.open(configuration_path, 'r') do |f|
          @@data = f.readlines.map(&:chomp)
        end
        @@data.freeze
      end
      @position = 0
    end

    def start
      refresh
    end

    # Do one step
    def refresh
      if done?
        finish
      else
        step
      end
    end

    def kill
      finish
    end

    private

    def finish
      publish_exit_status exit_code
    end

    def step
      publish_data(next_chunk, 'stdout')
    end

    def done?
      @position == @@data.count
    end

    def next_chunk
      output = @@data[@position]
      @position += 1
      output
    end

    # Decide if the execution should fail or not
    def exit_code
      fail_chance   = ENV.fetch('REX_DEBUG_FAIL_CHANCE', 0).to_i
      fail_exitcode = ENV['REX_DEBUG_EXIT'] || 0
      if fail_exitcode == 0 || fail_chance < (Random.rand * 100).round
        0
      else
        fail_exitcode
      end
    end

    def configuration_path
      path = ENV['REX_DEBUG_PATH'] || '/dev/null'
      File.expand_path(path)
    end

  end
end
