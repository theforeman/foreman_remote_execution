require "benchmark/benchmark_helper"
require 'dynflow/testing'

# Add plugin to FactoryGirl's paths
FactoryGirl.definition_file_paths << File.expand_path('../../factories', __FILE__)
FactoryGirl.reload

def generate_hosts(total)
  FactoryGirl.create_list(:host, total, :comment => "benchmark-#{Foreman.uuid}")
end

Rails.logger.level = Logger::ERROR

puts 'generating hosts'
generate_hosts(1000)
puts 'generating admin user'
admin = FactoryGirl.build(:user, :admin)
admin.save(:validate => false)
User.current = admin

puts 'starting benchmarking'
foreman_benchmark do
  Benchmark.ips do |x|
    x.config(:time => 10, :warmup => 0)

    x.report("rex-targeting-resolve-hosts") do
      targeting = FactoryGirl.create(:targeting, :search_query => "comment = benchmark-#{Foreman.uuid}", :user => User.current)
      targeting.resolve_hosts!
    end
  end
end
