module Types
  class RecurrenceInput < BaseInputObject
    argument :cron_line, String, required: false
    argument :max_iteration, Integer, required: false
    argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
  end
end
