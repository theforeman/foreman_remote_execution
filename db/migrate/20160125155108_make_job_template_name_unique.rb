class MakeJobTemplateNameUnique < ActiveRecord::Migration
  def up
    duplicates = JobTemplate.unscoped.group(:name).count.delete_if { |_name, value| value == 1 }
    duplicates.each_key do |duplicated_name|
      templates = JobTemplate.where(:name => duplicated_name)
      templates.each_with_index do |template, index|
        new_name = JobTemplate.exists?(:name => "#{template.name}-#{index}") ? "#{template.name}-#{index}-#{SecureRandom.hex(2)}" : "#{template.name}-#{index}"
        template.update_attribute(:name, new_name)
      end
    end
  end
end
