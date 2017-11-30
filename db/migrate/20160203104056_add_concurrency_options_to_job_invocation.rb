class AddConcurrencyOptionsToJobInvocation < ActiveRecord::Migration[4.2]
  def change
    add_column :job_invocations, :concurrency_level, :integer, :null => true
    add_column :job_invocations, :time_span, :integer, :null => true
  end
end
