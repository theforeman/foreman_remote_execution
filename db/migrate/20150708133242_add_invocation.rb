class AddInvocation < ActiveRecord::Migration[4.2]
  def change
    create_table :job_invocations do |t|
      t.references :targeting, :null => false
      t.string :job_name, :null => false, :limit => 255
    end

    add_index :job_invocations, [:targeting_id], :name => 'job_invocations_targeting_id'
    add_foreign_key :job_invocations, :targetings, :name => 'job_invocation_targeting_id', :column => 'targeting_id'
  end
end
