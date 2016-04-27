class AddDescriptionToJobInvocation < ActiveRecord::Migration
  def up
    add_column :job_invocations, :description, :string, :limit => 255
    add_column :templates, :description_format, :string, :limit => 255
  end

  def down
    remove_column :job_invocations, :description
    remove_column :templates, :description_format
  end
end
