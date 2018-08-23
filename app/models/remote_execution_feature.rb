class RemoteExecutionFeature < ApplicationRecord
  VALID_OPTIONS = [:provided_inputs, :description, :host_action_button, :notification_builder].freeze
  validates :label, :name, :presence => true, :uniqueness => true

  belongs_to :job_template

  audited :only => :job_template_id

  extend FriendlyId
  friendly_id :label

  scope :with_host_action_button, -> { where(:host_action_button => true) }

  def provided_input_names
    self.provided_inputs.to_s.split(',').map(&:strip)
  end

  def provided_input_names=(values)
    self.provided_inputs = Array(values).join(',')
  end

  def self.feature(label)
    self.find_by(label: label) || raise(::Foreman::Exception.new(N_('Unknown remote execution feature %s'), label))
  end

  # rubocop:disable Metrics/PerceivedComplexity
  def self.register(label, name, options = {})
    return false if Foreman.in_setup_db_rake? || !RemoteExecutionFeature.table_exists?
    options.assert_valid_keys(*VALID_OPTIONS)
    options[:host_action_button] = false unless options.key?(:host_action_button)

    feature = self.find_by(label: label)
    builder = options[:notification_builder] ? options[:notification_builder].to_s : nil

    attributes = { :name => name,
                   :provided_input_names => options[:provided_inputs],
                   :description => options[:description],
                   :host_action_button => options[:host_action_button],
                   :notification_builder => builder }
    # in case DB does not have the attribute created yet but plugin initializer registers the feature, we need to skip this attribute
    attrs = [ :host_action_button, :notification_builder ]
    attrs.each do |attr|
      unless self.attribute_names.include?(attr.to_s)
        attributes.delete(attr)
      end
    end

    self.without_auditing do
      if feature.nil?
        feature = self.create!({ :label => label }.merge(attributes))
      else
        feature.attributes = attributes
        feature.save if feature.changed?
      end
      return feature
    end
  end
  # rubocop:enable Metrics/PerceivedComplexity
end
