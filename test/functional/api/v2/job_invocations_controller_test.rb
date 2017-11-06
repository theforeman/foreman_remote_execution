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

      context 'creation' do
        setup do
          @attrs = { :job_category => @template.job_category,
                     :name => 'RandomName',
                     :job_template_id => @template.id,
                     :targeting_type => 'static_query',
                     :search_query => 'foobar' }
        end

        test 'should create valid with job_template_id' do
          post :create, params: { job_invocation: @attrs }

          invocation = ActiveSupport::JSON.decode(@response.body)
          assert_equal @attrs[:job_category], invocation['job_category']
          assert_response :success
        end

        test 'should create with description format overridden' do
          @attrs[:description_format] = 'format'
          post :create, params: { job_invocation: @attrs }

          invocation = ActiveSupport::JSON.decode(@response.body)
          assert_equal @attrs[:description_format], invocation['description']
        end

        test 'should create with recurrence' do
          @attrs[:recurrence] = { cron_line: '5 * * * *' }
          post :create, params: { job_invocation: @attrs }
          invocation = ActiveSupport::JSON.decode(@response.body)
          assert_equal invocation['mode'], 'recurring'
          assert_response :success
        end

        test 'should create with schedule' do
          @attrs[:scheduling] = { start_at: Time.now.to_s }
          post :create, params: { job_invocation: @attrs }
          invocation = ActiveSupport::JSON.decode(@response.body)
          assert_equal invocation['mode'], 'future'
          assert_response :success
        end

        test 'should create with feature' do
          feature = FactoryBot.create(:remote_execution_feature,
                                      :job_template => @template)
          attrs = {
            feature: feature.label,
            host_ids: ['testfqdn'],
            inputs: { 'plan_id' => 3, 'organization_id' => 10 }
          }
          # To avoid creating a host that has to be found on the
          # JobInvocationComposer I just mock it here
          Api::V2::JobInvocationsController.any_instance
                                           .expects(:resource_finder)
                                           .returns('testfqdn')
          JobInvocationComposer.expects(:for_feature).with(
            attrs[:feature],
            anything,
            has_entries('plan_id' => 3, 'organization_id' => 10)
          ).returns(OpenStruct.new(trigger!: true, job_invocation: @invocation))
          post :create, params: { job_invocation: attrs }
          assert_response :success
        end
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

      test 'should cancel a job' do
        @invocation.task.expects(:cancellable?).returns(true)
        @invocation.task.expects(:cancel).returns(true)
        JobInvocation.expects(:from_param).with(@invocation.id.to_s).returns(@invocation)
        post :cancel, :id => @invocation.id
        result = ActiveSupport::JSON.decode(@response.body)
        assert_equal result['cancelled'], true
        assert_equal result['id'], @invocation.id

        assert_response :success
      end

      test 'should abort a job' do
        @invocation.task.expects(:cancellable?).returns(true)
        @invocation.task.expects(:abort).returns(true)
        JobInvocation.expects(:from_param).with(@invocation.id.to_s).returns(@invocation)
        post :cancel, :id => @invocation.id, :force => true
        result = ActiveSupport::JSON.decode(@response.body)
        assert_equal result['cancelled'], true
        assert_equal result['id'], @invocation.id

        assert_response :success
      end

      test 'should error when trying to cancel a stopped job' do
        @invocation.task.expects(:cancellable?).returns(false)
        JobInvocation.expects(:from_param).with(@invocation.id.to_s).returns(@invocation)
        post :cancel, :id => @invocation.id
        assert_response 422
      end

      test 'should not allow the user to cancel the job if the user can\'t edit tasks' do
        user = FactoryBot.build(:user)
        user.roles << Role.find_by(:name => 'Tasks Reader')
        user.roles << Role.find_by(:name => 'Remote Execution Manager')
        user.save!

        admin = User.current
        User.current = user
        post :cancel, :id => @invocation.id
        assert_response 403
        User.current = admin
      end
    end
  end
end
