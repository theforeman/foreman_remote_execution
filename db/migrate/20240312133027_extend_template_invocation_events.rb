class ExtendTemplateInvocationEvents < ActiveRecord::Migration[6.1]
  def up
    change_table :template_invocation_events do |t|
      t.string :external_id
    end

    TemplateInvocationEvent.update_all("external_id = CASE WHEN event_type = 'exit' THEN 'exit' ELSE sequence_id::varchar END")

    # For each template invocation return the lowest id of its exit event, if there is more than 1 exit event
    scope = TemplateInvocationEvent.select("MIN(id) as id")
                                   .where(external_id: 'exit')
                                   .group(:template_invocation_id)
                                   .having("count(*) > 1")

    # Make sure there is at most one exit event per template invocation
    TemplateInvocationEvent.where(:id => scope.limit(BATCH_SIZE)).delete_all while scope.any?

    remove_index :template_invocation_events, name: :unique_template_invocation_events_index
    remove_column :template_invocation_events, :sequence_id

    change_table :template_invocation_events do |t|
      t.index [:template_invocation_id, :external_id],
        unique: true,
        name: 'unique_template_invocation_events_index'
      t.change :external_id, :string, null: false
    end
  end
end
