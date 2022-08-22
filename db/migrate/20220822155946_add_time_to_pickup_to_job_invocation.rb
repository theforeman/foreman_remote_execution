class AddTimeToPickupToJobInvocation < ActiveRecord::Migration[6.0]
  def change
    add_column :job_invocations, :time_to_pickup, :integer
  end
end
