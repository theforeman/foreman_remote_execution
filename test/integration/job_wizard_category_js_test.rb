# frozen_string_literal: true

require File.expand_path('../test_plugin_helper', __dir__)
require 'integration_test_helper'

class JobWizardCategoryJsTest < IntegrationTestWithJavascript
  WIZARD_INPUT_NAME = 'wizard_integration_input'

  setup do
    @original_rex_form_template = Setting[:remote_execution_form_job_template]
    as_admin do
      @default_job_template = FactoryBot.create(
        :job_template,
        :name => 'Integration Default REX Form Template',
        :job_category => 'Default Form Category'
      )
      @feature_job_template = FactoryBot.create(
        :job_template,
        :name => 'Integration Feature REX Template',
        :job_category => 'Feature Linked Category'
      )
      add_plain_template_input!(@default_job_template)
      add_plain_template_input!(@feature_job_template)
      Setting[:remote_execution_form_job_template] = @default_job_template.name
      @remote_execution_feature = FactoryBot.create(
        :remote_execution_feature,
        :label => 'integration_rex_category_feature',
        :name => 'Integration REX Category Feature',
        :job_template => @feature_job_template
      )
      @rex_host = FactoryBot.create(:host, :with_execution)
    end
  end

  teardown do
    Setting[:remote_execution_form_job_template] = @original_rex_form_template
  end

  test 'job wizard shows feature template job category when feature query param is present' do
    visit new_job_invocation_path(:feature => @remote_execution_feature.label)
    assert_text 'Category and template', :wait => 30
    wait_for_ajax
    assert_selector(:ouia_component_id, 'job_category', :text => 'Feature Linked Category', :wait => 30)
  end

  test 'job wizard shows default form category when no feature query param' do
    visit new_job_invocation_path
    assert_text 'Category and template', :wait => 30
    wait_for_ajax
    assert_selector(:ouia_component_id, 'job_category', :text => 'Default Form Category', :wait => 30)
  end

  test 'job wizard prefills template input from inputs query param' do
    visit new_job_invocation_path(
      :inputs => { WIZARD_INPUT_NAME => 'from_query_string' },
      :search => ''
    )
    go_to_target_hosts_and_inputs_step!
    assert_selector "textarea##{WIZARD_INPUT_NAME}", :wait => 30
    assert_equal 'from_query_string', find("textarea##{WIZARD_INPUT_NAME}").value
  end

  test 'job wizard does not prefill template input when inputs query param is omitted' do
    visit new_job_invocation_path(:search => '')
    go_to_target_hosts_and_inputs_step!
    assert_selector "textarea##{WIZARD_INPUT_NAME}", :wait => 30
    assert_equal '', find("textarea##{WIZARD_INPUT_NAME}").value
  end

  test 'job wizard prefills template input when feature and inputs query params are present' do
    visit new_job_invocation_path(
      :feature => @remote_execution_feature.label,
      :inputs => { WIZARD_INPUT_NAME => 'feature_and_inputs' },
      :search => ''
    )
    go_to_target_hosts_and_inputs_step!
    assert_selector "textarea##{WIZARD_INPUT_NAME}", :wait => 30
    assert_equal 'feature_and_inputs', find("textarea##{WIZARD_INPUT_NAME}").value
  end

  test 'job wizard run on selected hosts is enabled on review and posts to job invocations API' do
    posted_to_job_invocations_create = false
    subscriber = ActiveSupport::Notifications.subscribe('start_processing.action_controller') do |_n, _s, _f, _i, payload|
      if payload[:controller].to_s.end_with?('JobInvocationsController') && payload[:action].to_s == 'create'
        posted_to_job_invocations_create = true
      end
    end

    begin
      visit new_job_invocation_path(:search => "id = #{@rex_host.id}")
      navigate_job_wizard_to_review_step!

      assert_selector(:ouia_component_id, 'run-on-selected-hosts-footer', :wait => 30)
      run_on_hosts = find(:ouia_component_id, 'run-on-selected-hosts-footer')
      assert_includes [nil, 'false'], run_on_hosts[:'aria-disabled']
      assert_text 'Run on selected hosts'
      find(:ouia_component_id, 'run-on-selected-hosts-footer').click
      wait_for_ajax
      assert posted_to_job_invocations_create, 'expected Api::V2::JobInvocationsController#create to run'
      assert_match(%r{\A/job_invocations/\d+\z}, page.current_path)
    ensure
      ActiveSupport::Notifications.unsubscribe(subscriber)
    end
  end

  test 'job wizard create API request sends job_template_id and inputs for default template' do
    input_value = 'api_payload_default_template'
    job_inv_params = capture_api_job_invocation_params_during do
      visit new_job_invocation_path(
        :search => "id = #{@rex_host.id}",
        :inputs => { WIZARD_INPUT_NAME => input_value }
      )
      navigate_job_wizard_to_review_step!
      find(:ouia_component_id, 'run-on-selected-hosts-footer').click
      wait_for_ajax
    end

    assert job_inv_params, 'expected job_invocation key in POST /api/job_invocations'
    assert job_inv_params[:job_template_id].present?, 'expected job_template_id to be present'
    assert_equal @default_job_template.id, job_inv_params[:job_template_id].to_i
    assert job_inv_params[:feature].blank?
    assert_equal input_value, hash_from_params_object(job_inv_params[:inputs])[WIZARD_INPUT_NAME]
    job_invocation_id = page.current_path.split('/').last.to_i
    assert_equal @default_job_template.job_category, JobInvocation.find(job_invocation_id).job_category, 'expected job category to be the default template category'
  end

  test 'job wizard create API request sends feature label and inputs without job_template_id' do
    input_value = 'api_payload_feature_template'
    job_inv_params = capture_api_job_invocation_params_during do
      visit new_job_invocation_path(
        :feature => @remote_execution_feature.label,
        :search => "id = #{@rex_host.id}",
        :inputs => { WIZARD_INPUT_NAME => input_value }
      )
      navigate_job_wizard_to_review_step!
      find(:ouia_component_id, 'run-on-selected-hosts-footer').click
      wait_for_ajax
    end

    assert job_inv_params, 'expected job_invocation key in POST /api/job_invocations'
    assert_not job_inv_params[:job_template_id].present?
    assert_equal @remote_execution_feature.label, job_inv_params[:feature]
    assert_equal input_value, hash_from_params_object(job_inv_params[:inputs])[WIZARD_INPUT_NAME]
    job_invocation_id = page.current_path.split('/').last.to_i
    assert_equal @feature_job_template.job_category, JobInvocation.find(job_invocation_id).job_category, 'expected job category to be the feature template category'
  end

  private

  def capture_api_job_invocation_params_during
    captured = nil
    subscriber = ActiveSupport::Notifications.subscribe('start_processing.action_controller') do |_n, _s, _f, _i, payload|
      next unless payload[:controller].to_s.end_with?('JobInvocationsController') && payload[:action].to_s == 'create'
      root = payload[:params]
      root = root.to_unsafe_h if root.respond_to?(:to_unsafe_h)
      job_inv_params = root[:job_invocation] || root['job_invocation']
      next unless job_inv_params
      job_inv_params = job_inv_params.to_unsafe_h if job_inv_params.respond_to?(:to_unsafe_h)
      captured = job_inv_params.with_indifferent_access
    end
    begin
      yield
    ensure
      ActiveSupport::Notifications.unsubscribe(subscriber)
    end
    captured
  end

  def hash_from_params_object(obj)
    return {}.with_indifferent_access if obj.blank?
    h = obj.respond_to?(:to_unsafe_h) ? obj.to_unsafe_h : obj.to_h
    h.with_indifferent_access
  end

  def add_plain_template_input!(job_template)
    job_template.template_inputs << FactoryBot.build(
      :template_input,
      :name => WIZARD_INPUT_NAME,
      :input_type => 'user',
      :value_type => 'plain',
      :required => false
    )
    job_template.save!
  end

  def job_wizard_click_next!
    wait_for_ajax
    find(:ouia_component_id, 'next-footer').click
    wait_for_ajax
  end

  def go_to_target_hosts_and_inputs_step!
    assert_text 'Category and template', :wait => 30
    wait_for_ajax
    job_wizard_click_next!
    assert_text 'Target hosts and inputs', :wait => 30
    wait_for_ajax
  end

  def navigate_job_wizard_to_review_step!
    assert_text 'Category and template', :wait => 30
    wait_for_ajax
    job_wizard_click_next!
    assert_text 'Target hosts and inputs', :wait => 30
    job_wizard_click_next!
    assert_text 'Advanced fields', :wait => 30
    job_wizard_click_next!
    assert_text 'Immediate execution', :wait => 30
    job_wizard_click_next!
    assert_text 'Review details', :wait => 30
    wait_for_ajax
  end
end
