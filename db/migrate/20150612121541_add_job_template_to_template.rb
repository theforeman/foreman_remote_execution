class AddJobTemplateToTemplate < ActiveRecord::Migration[4.2]
  def change
    change_table :templates, :bulk => true do |t|
      t.column :job_name, :string, :limit => 255
      t.column :provider_type, :string, :limit => 255
    end
  end
end
