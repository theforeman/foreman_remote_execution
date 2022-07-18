class TemplateInvocationEvent < ::ApplicationRecord
  belongs_to :template_invocation

  def as_raw_continuous_output
    raw = attributes
    raw['output_type'] = raw.delete('event_type')
    raw['output'] = raw.delete('event')
    raw['timestamp'] = raw['timestamp'].to_f
    raw
  end
end
