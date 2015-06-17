class AddJobTemplateToTemplate < ActiveRecord::Migration
  def change
    add_column :templates, :job_name, :string
    add_column :templates, :provider_type, :string
  end
end
