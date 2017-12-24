require 'test_plugin_helper'

module Api
  module V2
    class JobInvocationsControllerTest < ActionController::TestCase
      setup do
        @invocation = FactoryBot.create(:job_invocation, :with_template, :with_task)
        @template = FactoryBot.create(:job_template, :with_input)
      end

      test 'should get index' do
        get :index
        invocations = ActiveSupport::JSON.decode(@response.body)
        refute_empty invocations, 'Should response with invocation'
        assert_response :success
      end

      test 'should get invocation detail' do
        get :show, params: { :id => @invocation.id }
        assert_response :success
        template = ActiveSupport::JSON.decode(@response.body)
        refute_empty template
        assert_equal template['job_category'], @invocation.job_category
      end

      test 'should create valid with job_template_id' do
        attrs = { :job_category => @template.job_category, :name => 'RandomName', :job_template_id => @template.id,
                  :targeting_type => 'static_query', :search_query => 'foobar'}
        post :create, params: { :job_invocation => attrs }

        invocation = ActiveSupport::JSON.decode(@response.body)
        assert_equal attrs[:job_category], invocation['job_category']
        assert_response :success
      end

      test 'should create with description format overridden' do
        attrs = { :job_category => @template.job_category, :name => 'RandomName', :job_template_id => @template.id,
                  :targeting_type => 'static_query', :search_query => 'foobar', :description_format => 'format' }
        post :create, params: { :job_invocation => attrs }

        invocation = ActiveSupport::JSON.decode(@response.body)
        assert_equal attrs[:description_format], invocation['description']
      end

      test 'should create with recurrence' do
        attrs = { :job_category => @template.job_category, :name => 'RandomName',
                  :job_template_id => @template.id,:targeting_type => 'static_query',
                  :search_query => 'foobar', :recurrence => {:cron_line => '5 * * * *'}}

        post :create, params: { :job_invocation => attrs }
        invocation = ActiveSupport::JSON.decode(@response.body)
        assert_equal invocation['mode'], 'recurring'
        assert_response :success
      end

      test 'should create with schedule' do
        attrs = { :job_category => @template.job_category, :name => 'RandomName',
                  :job_template_id => @template.id,:targeting_type => 'static_query',
                  :search_query => 'foobar', :scheduling => {:start_at => Time.now.to_s}}

        post :create, params: { :job_invocation => attrs }
        invocation = ActiveSupport::JSON.decode(@response.body)
        assert_equal invocation['mode'], 'future'
        assert_response :success
      end

      test 'should provide output for delayed task' do
        host = @invocation.template_invocations_hosts.first
        ForemanTasks::Task.any_instance.expects(:delayed?).returns(true)
        get :output, params: { :job_invocation_id => @invocation.id, :host_id => host.id }
        result = ActiveSupport::JSON.decode(@response.body)
        assert_equal result['delayed'], true
        assert_equal result['refresh'], true
        assert_equal result['output'], []
        assert_response :success
      end
    end
  end
end
