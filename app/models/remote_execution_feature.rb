class RemoteExecutionFeature < ActiveRecord::Base
  VALID_OPTIONS = [:provided_inputs, :description, :host_action_button]
  validates :label, :name, :presence => true, :uniqueness => true

  belongs_to :job_template

  extend FriendlyId
  friendly_id :label

  scope :with_host_action_button, lambda { where(:host_action_button => true) }

  def provided_input_names
    self.provided_inputs.to_s.split(',').map(&:strip)
  end

  def provided_input_names=(values)
    self.provided_inputs = Array(values).join(',')
  end

  def self.feature(label)
    self.find_by_label(label) || raise(::Foreman::Exception.new(N_('Unknown remote execution feature %s'), label))
  end

  def self.register(label, name, options = {})
    return false unless RemoteExecutionFeature.table_exists?
    options.assert_valid_keys(*VALID_OPTIONS)
    options[:host_action_button] = false unless options.key?(:host_action_button)
    feature = self.find_by_label(label)
    if feature.nil?
      feature = self.create!(:label => label, :name => name, :provided_input_names => options[:provided_inputs], :description => options[:description], :host_action_button => options[:host_action_button])
    else
      feature.attributes = { :name => name, :provided_input_names => options[:provided_inputs], :description => options[:description], :host_action_button => options[:host_action_button] }
      feature.save if feature.changed?
    end
    return feature
  end
end
