class RemoteExecutionFeature < ApplicationRecord
  VALID_OPTIONS = [:provided_inputs, :description, :host_action_button, :notification_builder, :proxy_selector_override].freeze
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
    self.find_by(label: label)
  end

  def self.feature!(label)
    feature(label) || raise(::Foreman::Exception.new(N_('Unknown remote execution feature %s'), label))
  end

  def self.register(label, name, options = {})
    pending_migrations = ::Foreman::Plugin.registered_plugins[:foreman_remote_execution]&.pending_migrations
    begin
      # Let's not try to register features if rex is not registered as a plugin
      return false if pending_migrations || pending_migrations.nil?
    rescue ActiveRecord::NoDatabaseError => e
      # just ignore the problem if DB does not exist yet (rake db:create call)
      return false
    end

    options.assert_valid_keys(*VALID_OPTIONS)
    options[:host_action_button] = false unless options.key?(:host_action_button)

    feature = self.find_by(label: label)
    builder = options[:notification_builder] ? options[:notification_builder].to_s : nil

    attributes = { :name => name,
                   :provided_input_names => options[:provided_inputs],
                   :description => options[:description],
                   :host_action_button => options[:host_action_button],
                   :proxy_selector_override => options[:proxy_selector_override],
                   :notification_builder => builder }
    # in case DB does not have the attribute created yet but plugin initializer registers the feature, we need to skip this attribute
    [:host_action_button, :notification_builder].each do |attr|
      unless self.attribute_names.include?(attr.to_s)
        attributes.delete(attr)
      end
    end
    # do not let to set attributes with nil constraint and use default value
    [:host_action_button].each { |attr| attributes.delete(attr) if attributes[attr].nil? }

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
end
