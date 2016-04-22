class RemoteExecutionFeature < ActiveRecord::Base
  attr_accessible :label, :name, :provided_input_names, :description, :job_template_id

  validates :label, :name, :presence => true, :uniqueness => true

  belongs_to :job_template

  extend FriendlyId
  friendly_id :label

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
    options.assert_valid_keys(:provided_inputs, :description)
    feature = self.find_by_label(label)
    if feature.nil?
      feature = self.create!(:label => label, :name => name, :provided_input_names => options[:provided_inputs], :description => options[:description])
    else
      feature.update_attributes!(:name => name, :provided_input_names => options[:provided_inputs], :description => options[:description])
    end
    return feature
  end
end
