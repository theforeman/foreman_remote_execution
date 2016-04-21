class AddJobTemplateToTemplate < ActiveRecord::Migration
  def change
    add_column :templates, :job_name, :string, :limit => 255
    add_column :templates, :provider_type, :string, :limit => 255
  end
end
