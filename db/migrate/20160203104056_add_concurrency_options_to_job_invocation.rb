class AddConcurrencyOptionsToJobInvocation < ActiveRecord::Migration[4.2]
  def change
    change_table :job_invocations, :bulk => true do |t|
      t.column :concurrency_level, :integer, :null => true
      t.column :time_span, :integer, :null => true
    end
  end
end
