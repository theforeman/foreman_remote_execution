require 'benchmark/benchmark_helper'
require 'dynflow/testing'

# Add plugin to FactoryBot's paths
FactoryBot.definition_file_paths << File.expand_path('../../factories', __FILE__)
FactoryBot.definition_file_paths << "#{ForemanTasks::Engine.root}/test/factories"
FactoryBot.reload

module Actions
  module RemoteExecution
    class RunHostsJob < Actions::ActionWithSubPlans
      # stub function that calls other actions.
      def trigger(*args)
        nil
      end
    end
  end
end

module Support
  class DummyDynflowAction < Dynflow::Action
  end
end

def generate_hosts(total)
  FactoryBot.create_list(:host, total, :comment => "benchmark-#{Foreman.uuid}")
end

Rails.logger.level = Logger::ERROR

class ActionTester
  include Dynflow::Testing::Factories

  def initialize(task)
    @task = task
  end

  def run_action(*args)
    action = create_action(Actions::RemoteExecution::RunHostsJob)
    @task.update(:external_id => action.execution_plan_id)
    plan_action(action, *args)
  end
end

puts 'generating admin user'
admin = FactoryBot.build(:user, :admin)
admin.save(:validate => false)
User.current = admin
targeting = FactoryBot.create(:targeting, :search_query => "comment = benchmark-#{Foreman.uuid}", :user => User.current)
template_invocation = FactoryBot.build(:template_invocation, :job_invocation => nil)
job_invocation = FactoryBot.build(:job_invocation, :targeting => targeting, :pattern_template_invocations => [template_invocation]).tap do |invocation|
  invocation.targeting = targeting
  invocation.save
end

task = FactoryBot.create(:dynflow_task, :external_id => '1')
tester = ActionTester.new(task)

puts 'generating hosts'
generate_hosts(1000)
puts 'starting benchmarking'
foreman_benchmark do
  Benchmark.ips do |x|
    x.config(:time => 10, :warmup => 0)

    x.report('rex-run-hosts-job') do
      tester.run_action(job_invocation)
    end
  end
end
