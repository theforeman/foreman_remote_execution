class AddJobTemplateToTemplate < ActiveRecord::Migration[4.2]
  def change
    add_column :templates, :job_name, :string, :limit => 255
    add_column :templates, :provider_type, :string, :limit => 255
  end
end
