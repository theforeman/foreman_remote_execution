class AddJobAction < ActiveRecord::Migration[6.0]
  def change
    create_table :job_actions do |t|
      t.string :name, null: false, limit: 255
      t.references :job_template, null: false
      t.references :user, null: false
    end
  end
end
