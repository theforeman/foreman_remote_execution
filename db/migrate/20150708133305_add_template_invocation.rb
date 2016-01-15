class AddTemplateInvocation < ActiveRecord::Migration
  def change
    create_table :template_invocations do |t|
      t.references :template, :null => false
      t.references :job_invocation, :null => false
    end

    add_index :template_invocations, [:template_id, :job_invocation_id], :name => 'targeting_invocation_template_ji_ids'
    add_foreign_key :template_invocations, :templates, :name => 'template_invoc_template_id', :column => 'template_id'
    add_foreign_key :template_invocations, :job_invocations, :name => 'template_invoc_job_invocation_id', :column => 'job_invocation_id'

    create_table :template_invocation_input_values do |t|
      t.references :template_invocation, :null => false
      t.references :template_input, :null => false
      t.string :value, :null => false
    end

    add_index :template_invocation_input_values, [:template_invocation_id, :template_input_id], :name => 'template_invocation_input_values_ti_ti_ids'
    add_foreign_key :template_invocation_input_values, :template_invocations, :name => 'template_invoc_input_values_template_invoc_id', :column => 'template_invocation_id'
    add_foreign_key :template_invocation_input_values, :template_inputs, :name => 'template_invoc_input_values_template_input_id', :column => 'template_input_id'
  end
end
