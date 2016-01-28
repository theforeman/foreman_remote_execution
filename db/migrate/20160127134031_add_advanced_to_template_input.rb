class AddAdvancedToTemplateInput < ActiveRecord::Migration
  def up
    add_column :template_inputs, :advanced, :boolean, :default => false, :null => false
    template = JobTemplate.find_by_name('Package Action - SSH Default')
    TemplateInput.where(:name => ['pre_script', 'post_script'], :template_id => template.try(:id)).update_all(:advanced => true)
  end

  def down
    remove_column :template_inputs, :advanced
  end
end
