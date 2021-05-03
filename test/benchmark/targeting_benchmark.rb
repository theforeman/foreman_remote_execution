require 'benchmark/benchmark_helper'
require 'dynflow/testing'

# Add plugin to FactoryBot's paths
FactoryBot.definition_file_paths << File.expand_path('../../factories', __FILE__)
FactoryBot.reload

def generate_hosts(total)
  FactoryBot.create_list(:host, total, :comment => "benchmark-#{Foreman.uuid}")
end

Rails.logger.level = Logger::ERROR

puts 'generating hosts'
generate_hosts(1000)
puts 'generating admin user'
admin = FactoryBot.build(:user, :admin)
admin.save(:validate => false)
User.current = admin

puts 'starting benchmarking'
foreman_benchmark do
  Benchmark.ips do |x|
    x.config(:time => 10, :warmup => 0)

    x.report('rex-targeting-resolve-hosts') do
      targeting = FactoryBot.create(:targeting, :search_query => "comment = benchmark-#{Foreman.uuid}", :user => User.current)
      targeting.resolve_hosts!
    end
  end
end
