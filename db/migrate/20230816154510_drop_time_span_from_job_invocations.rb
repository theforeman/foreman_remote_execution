class DropTimeSpanFromJobInvocations < ActiveRecord::Migration[6.0]
  def change
    remove_column :job_invocations, :time_span, :integer, :null => true
  end
end
