class CreateJobTemplateEffectiveUsers < ActiveRecord::Migration[4.2]
  def change
    create_table :job_template_effective_users do |t|
      t.integer :job_template_id
      t.string :value, :limit => 255
      t.boolean :overridable
      t.boolean :current_user
    end

    add_index :job_template_effective_users, :job_template_id, :name => 'effective_users_job_template_id'
    add_foreign_key :job_template_effective_users, :templates, :column => :job_template_id
  end
end
