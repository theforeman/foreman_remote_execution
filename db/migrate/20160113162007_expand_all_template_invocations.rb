class ExpandAllTemplateInvocations < ActiveRecord::Migration[4.2]
  class FakeTemplateInvocation < ApplicationRecord
    self.table_name = 'template_invocations'

    has_many :input_values, :class_name => 'FakeInputValue', :foreign_key => 'template_invocation_id'
  end

  class FakeInputValue < ApplicationRecord
    self.table_name = 'template_invocation_input_values'
  end

  def up
    # make all template invocations pattern
    FakeTemplateInvocation.update_all 'host_id = NULL'

    # expand all pattern template invocations and link RunHostJob
    JobInvocation.joins(:targeting).where("#{Targeting.table_name}.resolved_at IS NOT NULL").includes([:pattern_template_invocations, :targeting]).find_each do |job_invocation|
      job_invocation.pattern_template_invocations.each do |pattern_template_invocation|
        job_invocation.targeting.hosts.each do |host|
          task = job_invocation.sub_tasks.find do |sub_task|
            sub_task.locks.find { |lock| lock.resource_type == 'Host::Managed' && lock.resource_id == host.id && lock.name == 'link_resource' }.present?
          end
          next if task.nil? # job invocations with static targeting that failed too early

          expanded_template_invocation = FakeTemplateInvocation.new
          expanded_template_invocation.attributes = pattern_template_invocation.dup.attributes
          pattern_template_invocation.input_values.each do |input_value|
            input_value = input_value.dup
            expanded_template_invocation.input_values.build(input_value.attributes.except('template_invocation_id'))
          end
          expanded_template_invocation.host_id = host.id
          expanded_template_invocation.run_host_job_task_id = task.id
          expanded_template_invocation.save!
        end
      end
    end
  end

  def down
    # we can't determine the last host for pattern, but keeping template invocations as pattern is safe
    JobInvocation.joins(:targeting).where("#{Targeting.table_name}.resolved_at IS NOT NULL").includes(:template_invocations).find_each do |job_invocation|
      job_invocation.template_invocations.delete_all
    end
  end
end
