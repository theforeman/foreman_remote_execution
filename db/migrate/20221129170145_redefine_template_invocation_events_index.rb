class RedefineTemplateInvocationEventsIndex < ActiveRecord::Migration[6.0]
  def up
    change_table :template_invocation_events do |t|
      t.remove_index name: :unique_template_invocation_events_index
      t.integer :sequence_id
    end

    execute <<~SQL
      WITH extended_t AS
      (
          SELECT id, row_number() over (PARTITION BY template_invocation_id ORDER BY timestamp ASC) AS rn
          FROM template_invocation_events
      )
      UPDATE template_invocation_events SET sequence_id = extended_t.rn
      FROM extended_t
      WHERE template_invocation_events.id = extended_t.id;
    SQL

    change_table :template_invocation_events do |t|
      t.index [:template_invocation_id, :sequence_id],
        unique: true,
        name: 'unique_template_invocation_events_index'
      t.change :sequence_id, :integer, null: false
    end
  end

  def down
    change_table :template_invocation_events do |t|
      t.remove_index name: :unique_template_invocation_events_index
      t.remove :sequence_id
      t.index [:template_invocation_id, :timestamp, :event_type],
        unique: true,
        name: 'unique_template_invocation_events_index'
    end
  end
end
