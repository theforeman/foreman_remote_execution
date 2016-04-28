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

      composer.targeting.search_query.must_equal "name = #{host.name}"
    end
  end
end
