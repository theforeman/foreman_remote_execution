require 'test_plugin_helper'

class RemoteExecutionFeatureTest < ActiveSupport::TestCase
  should validate_presence_of(:name)
  should validate_presence_of(:label)
  should validate_uniqueness_of(:name)
  should validate_uniqueness_of(:label)

  let(:install_feature) do
    RemoteExecutionFeature.register(:katello_install_package, N_('Katello: Install package'),
      :description => 'Install package via Katello user interface',
      :provided_inputs => ['package'])
  end

  let(:package_template) do
    FactoryBot.create(:job_template).tap do |job_template|
      job_template.job_category = 'Package Action'
      job_template.name = 'Package Action - SSH Default'
      job_template.template_inputs.create(:name => 'package', :input_type => 'user')
    end
  end

  let(:host) { FactoryBot.create(:host) }

  before do
    User.current = users :admin
    install_feature.update!(:job_template_id => package_template.id)
  end

  describe 'composer' do
    it 'prepares composer for given feature based on the mapping' do
      composer = JobInvocationComposer.for_feature(:katello_install_package, host, :package => 'zsh')
      assert composer.valid?
      assert_equal 1, composer.pattern_template_invocations.size
      template_invocation = composer.pattern_template_invocations.first
      assert_equal package_template, template_invocation.template
      assert_equal 1, template_invocation.input_values.size

      input_value = template_invocation.input_values.first
      assert_equal 'zsh', input_value.value
      assert_equal 'package', input_value.template_input.name

      assert_equal "name ^ (#{host.name})", composer.targeting.search_query
    end

    it 'updates the feature when attributes change' do
      updated_feature = RemoteExecutionFeature.register(install_feature.label, N_('Katello: Install package'),
        :description => 'New description',
        :provided_inputs => ['package', 'force'])
      updated_feature.reload
      assert_equal install_feature.id, updated_feature.id
      assert_equal 'New description', updated_feature.description
      assert_equal ['package', 'force'], updated_feature.provided_input_names
    end
  end

  describe '.register' do
    it "creates a feature if it's missing" do
      feature = RemoteExecutionFeature.register('new_feature_that_does_not_exist', 'name')
      assert feature.persisted?
      assert_equal 'new_feature_that_does_not_exist', feature.label
      assert_equal 'name', feature.name
      assert_not feature.host_action_button
    end

    it 'creates a feature with host action flag' do
      feature = RemoteExecutionFeature.register('new_feature_that_does_not_exist_button', 'name', :host_action_button => true)
      assert feature.persisted?
      assert feature.host_action_button
    end

    it 'created feature with host action flag can be found using named scope' do
      feature = RemoteExecutionFeature.register('new_feature_that_does_not_exist_button', 'name', :host_action_button => true)
      assert_includes RemoteExecutionFeature.with_host_action_button, feature
    end


    it 'updates a feature if it exists' do
      existing = FactoryBot.create(:remote_execution_feature, :name => 'existing_feature_withou_action_button')
      feature = RemoteExecutionFeature.register(existing.label, existing.name, :host_action_button => true)
      assert feature.persisted?
      existing.reload
      assert existing.host_action_button
    end
  end
end
