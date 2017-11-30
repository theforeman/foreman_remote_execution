class AddExecutionToInterface < ActiveRecord::Migration[4.2]
  class FakeNic < ActiveRecord::Base
    self.table_name = 'nics'

    def type
      Nic::Managed
    end
  end

  def up
    add_column :nics, :execution, :boolean, :default => false

    FakeNic.reset_column_information
    FakeNic.all.each do |nic|
      nic.update_column(:execution, true) if nic.primary
    end
  end

  def down
    remove_column :nics, :execution
  end
end
