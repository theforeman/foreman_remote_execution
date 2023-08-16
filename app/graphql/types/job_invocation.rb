module Types
  class JobInvocation < BaseObject
    description 'A Job Invocation'

    global_id_field :id
    field :job_category, String
    field :description, String
    field :start_at, GraphQL::Types::ISO8601DateTime
    field :status_label, String

    belongs_to :triggering, Types::Triggering
    belongs_to :task, Types::Task
    field :recurring_logic, Types::RecurringLogic
  end
end
