# frozen_string_literal: true

require 'test_plugin_helper'

class JobInvocationsControllerTest < ActionController::TestCase
  test 'should parse inputs coming from the URL params' do
    template = FactoryBot.create(:job_template, :with_input)
    feature = FactoryBot.create(:remote_execution_feature,
      :job_template => template)
    params = {
      feature: feature.label,
      inputs: { template.template_inputs.first.name => 'foobar' },
    }

    get :new, params: params, session: set_session_user
    template_invocation_params = [
      {
        'input_values' =>
        [
          {
            'value' => 'foobar',
            'template_input_id' => template.template_inputs.first.id,
          },
        ],
        'template_id' => template.id,
      },
    ]
    assert_equal(template_invocation_params,
      assigns(:composer).params['template_invocations'])
  end

  test 'should allow no inputs' do
    template = FactoryBot.create(:job_template)
    feature = FactoryBot.create(:remote_execution_feature,
      :job_template => template)
    params = {
      feature: feature.label,
    }
    get :new, params: params, session: set_session_user
    template_invocation_params = [
      {
        'template_id' => template.id,
        'input_values' => {},
      },
    ]
    assert_equal(template_invocation_params,
      assigns(:composer).params['template_invocations'])
  end
end
