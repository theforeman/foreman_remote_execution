module Types
  class SchedulingInput < BaseInputObject
    argument :start_at, String, required: false
    argument :start_before, String, required: false
  end
end
