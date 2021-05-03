module ForemanRemoteExecution
  module TemplateOverrides
    def inputs_unchanged_when_locked
      inputs_changed = template_inputs.any? { |input| input.changed? || input.new_record? }
      foreign_input_sets_changed = foreign_input_sets.any? { |input_set| input_set.changed? || input_set.new_record? }
      if inputs_changed || foreign_input_sets_changed
        errors.add(:base, _('This template is locked. Please clone it to a new template to customize.'))
      end
    end
  end
end
