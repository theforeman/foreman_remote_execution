class CreateTemplateInvocationEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :template_invocation_events do |t|
      t.references :template_invocation, :null => false
      t.timestamp :timestamp, :null => false
      t.string :event_type, :null => false
      t.string :event, :null => false
      t.string :meta
    end
  end
end
