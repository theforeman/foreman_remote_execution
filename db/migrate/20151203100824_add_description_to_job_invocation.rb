class AddDescriptionToJobInvocation < ActiveRecord::Migration
  def up
    add_column :job_invocations, :description, :string
    add_column :templates, :description_format, :string
  end

  def down
    remove_column :job_invocations, :description
    remove_column :templates, :description_format
  end
end
