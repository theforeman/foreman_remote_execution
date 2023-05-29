class ChangeIndex < ActiveRecord::Migration[6.1]
  def up
    remove_index :template_invocation_events, name: 'unique_template_invocation_events_index'
    add_index :template_invocation_events, [:template_invocation_id, :sequence_id], name: 'unique_template_invocation_events_index', unique: true
  end

  def down
    change_table :template_invocation_events do |t|
      t.remove_index name: :unique_template_invocation_events_index
      t.index [:template_invocation_id, :timestamp, :event_type, :sequence_id],
        unique: true,
        name: 'unique_template_invocation_events_index'
    end
  end
end
