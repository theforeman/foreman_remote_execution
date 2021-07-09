module Types
  class RecurrenceInput < BaseInputObject
    argument :cron_line, String, required: false
    argument :max_iteration, Integer, required: false
    argument :end_time, String, required: false
    argument :purpose, String, required: false
  end
end
