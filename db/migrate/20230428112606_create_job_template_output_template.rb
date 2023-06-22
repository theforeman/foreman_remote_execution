class CreateJobTemplateOutputTemplate < ActiveRecord::Migration[6.1]
  def change
    create_table :job_template_output_templates do |t|
      t.references :job_template, null: false, foreign_key: {to_table: :templates}
      t.references :output_template, null: false, foreign_key: {to_table: :templates}
    end
  end
end
