class ForeignInputSet < ActiveRecord::Base
  class CircularDependencyError < Foreman::Exception
  end

  attr_accessible :template_id, :target_template_id, :include_all, :include, :exclude

  belongs_to :template
  belongs_to :target_template, :class_name => 'Template'

  scoped_search :on => :target_template_id, :complete_value => true

  validates :target_template, :presence => true
  validate :check_circular_dependency

  def inputs(templates_stack = [])
    return [] unless target_template
    if templates_stack.include?(target_template)
      raise CircularDependencyError.new(N_("Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}"),
                                        :template => template.name, :target_template => target_template.name, :templates_stack => templates_stack.map(&:name).inspect)
    end
    inputs = target_template.template_inputs_with_foreign(templates_stack + [target_template])
    unless self.include_all?
      inputs = inputs.select { |input| included_names.include?(input.name) }
    end
    inputs = inputs.reject { |input| excluded_names.include?(input.name) }
    return inputs
  end

  def included_names
    comma_separated_names(self.include)
  end

  def excluded_names
    comma_separated_names(self.exclude)
  end

  private

  def comma_separated_names(value)
    value.to_s.split(',').map(&:strip)
  end

  def check_circular_dependency
    self.inputs
    true
  rescue CircularDependencyError => e
    self.errors.add :base, e.message
  end
end
