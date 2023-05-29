class CreateJobInvocationTemplate < ActiveRecord::Migration[6.1]
  def change
    create_table :job_invocation_templates do |t|
      t.references :job_invocation, null: false, foreign_key: true
      t.references :output_template, null: false, foreign_key: {to_table: :templates}

      t.timestamps
    end
  end
end
