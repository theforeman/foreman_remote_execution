class AddExecutionToInterface < ActiveRecord::Migration[4.2]
  def up
    add_column :nics, :execution, :boolean, :default => false

    Nic::Managed.reset_column_information
    Nic::Managed.where(primary: true).update_all(execution: true)
  end

  def down
    remove_column :nics, :execution
  end
end
