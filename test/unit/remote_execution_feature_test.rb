require 'test_plugin_helper'

describe RemoteExecutionFeature do
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
    FactoryGirl.create(:job_template).tap do |job_template|
      job_template.job_category = 'Package Action'
      job_template.name = 'Package Action - SSH Default'
      job_template.template_inputs.create(:name => 'package', :input_type => 'user')
    end
  end

  let(:host) { FactoryGirl.create(:host) }

  before do
    User.current = users :admin
    install_feature.update_attributes!(:job_template_id => package_template.id)
  end

  describe 'composer' do
    it 'prepares composer for given feature based on the mapping' do
      composer = JobInvocationComposer.for_feature(:katello_install_package, host, :package => 'zsh')
      assert composer.valid?
      composer.pattern_template_invocations.size.must_equal 1
      template_invocation = composer.pattern_template_invocations.first
      template_invocation.template.must_equal package_template
      template_invocation.input_values.size.must_equal 1

      input_value = template_invocation.input_values.first
      input_value.value.must_equal 'zsh'
      input_value.template_input.name.must_equal 'package'

      composer.targeting.search_query.must_equal "name ^ (#{host.name})"
    end

    it "updates the feature when attributes change" do
      updated_feature = RemoteExecutionFeature.register(install_feature.label, N_('Katello: Install package'),
                                                        :description => 'New description',
                                                        :provided_inputs => ['package', 'force'])
      updated_feature.reload
      updated_feature.id.must_equal(install_feature.id)
      updated_feature.description.must_equal 'New description'
      updated_feature.provided_input_names.must_equal ['package', 'force']
    end
  end

  describe '.register' do
    it "creates a feature if it's missing" do
      feature = RemoteExecutionFeature.register('new_feature_that_does_not_exist', 'name')
      feature.must_be :persisted?
      feature.label.must_equal 'new_feature_that_does_not_exist'
      feature.name.must_equal 'name'
      refute feature.host_action_button
    end

    it "creates a feature with host action flag" do
      feature = RemoteExecutionFeature.register('new_feature_that_does_not_exist_button', 'name', :host_action_button => true)
      feature.must_be :persisted?
      assert feature.host_action_button
    end

    it "created feature with host action flag can be found using named scope" do
      feature = RemoteExecutionFeature.register('new_feature_that_does_not_exist_button', 'name', :host_action_button => true)
      assert_includes RemoteExecutionFeature.with_host_action_button, feature
    end


    it "updates a feature if it exists" do
      existing = FactoryGirl.create(:remote_execution_feature, :name => 'existing_feature_withou_action_button')
      feature = RemoteExecutionFeature.register(existing.label, existing.name, :host_action_button => true)
      feature.must_be :persisted?
      existing.reload
      assert existing.host_action_button
    end
  end
end
