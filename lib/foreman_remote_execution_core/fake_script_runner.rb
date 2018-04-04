module ForemanRemoteExecutionCore
  class FakeScriptRunner < ForemanTasksCore::Runner::Base
    DEFAULT_REFRESH_INTERVAL = 1

    @data = []

    class << self
      attr_accessor :data

      def load_data(path = nil)
        if path.nil?
          @data = <<-END.gsub(/^\s+\| ?/, '').lines
            | ====== Simulated Remote Execution ======
            |
            | This is an output of a simulated remote
            | execution run. It should run for about
            | 5 seconds and finish successfully.
          END
        else
          File.open(File.expand_path(path), 'r') do |f|
            @data = f.readlines.map(&:chomp)
          end
        end
        @data.freeze
      end

      def self.build(options)
        new(options)
      end
    end

    def initialize(*args)
      super
      # Load the fake output the first time its needed
      self.class.load_data(ENV['REX_SIMULATE_PATH']) unless self.class.data.frozen?
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
      @position == self.class.data.count
    end

    def next_chunk
      output = self.class.data[@position]
      @position += 1
      output
    end

    # Decide if the execution should fail or not
    def exit_code
      fail_chance   = ENV.fetch('REX_SIMULATE_FAIL_CHANCE', 0).to_i
      fail_exitcode = ENV.fetch('REX_SIMULATE_EXIT', 0).to_i
      if fail_exitcode == 0 || fail_chance < (Random.rand * 100).round
        0
      else
        fail_exitcode
      end
    end
  end
end
