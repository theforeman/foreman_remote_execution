module Types
  class SchedulingInput < BaseInputObject
    argument :start_at, GraphQL::Types::ISO8601DateTime, required: false
    argument :start_before, GraphQL::Types::ISO8601DateTime, required: false
  end
end
