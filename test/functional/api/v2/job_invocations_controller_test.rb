require 'test_plugin_helper'

module Api
  module V2
    class JobInvocationsControllerTest < ActionController::TestCase
      setup do
        @invocation = FactoryBot.create(:job_invocation, :with_template, :with_task, :with_unplanned_host)
        @template = FactoryBot.create(:job_template, :with_input)

        # Without this the template in template_invocations and in pattern_template_invocations
        # would belong to different job_categories, causing trouble when trying to rerun
        @invocation.job_category = @invocation.pattern_template_invocations.first.template.job_category
        @invocation.save!
      end

      test 'should get index' do
        get :index
        invocations = ActiveSupport::JSON.decode(@response.body)
        assert_not_empty invocations, 'Should response with invocation'
        assert_response :success
      end

      describe 'show' do
        test 'should get invocation detail' do
          get :show, params: { :id => @invocation.id }
          assert_response :success
          template = ActiveSupport::JSON.decode(@response.body)
          assert_not_empty template
          assert_equal template['job_category'], @invocation.job_category
          assert_not_empty template['targeting']['hosts']
        end

        test 'should get invocation detail when taxonomies are set' do
          taxonomy_params = %w(organization location).reduce({}) { |acc, cur| acc.merge("#{cur}_id" => FactoryBot.create(cur)) }
          get :show, params: taxonomy_params.merge(:id => @invocation.id)
          assert_response :success
        end

        test 'should see only permitted hosts' do
          @user = FactoryBot.create(:user, admin: false)
          setup_user('view', 'job_invocations', nil, @user)
          setup_user('view', 'hosts', 'name ~ nope.example.com', @user)

          get :show, params: { :id => @invocation.id }, session: set_session_user(@user)
          assert_response :success
          response = ActiveSupport::JSON.decode(@response.body)
          assert_empty response['targeting']['hosts']
        end
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

        context 'with_feature' do
          setup do
            @feature = FactoryBot.create(:remote_execution_feature,
              :job_template => @template)
            @attrs = {
              feature: @feature.label,
            }
          end

          test 'host ids as array of FQDNs' do
            host = FactoryBot.create(:host)
            @attrs[:host_ids] = [host.fqdn]
            post :create, params: { job_invocation: @attrs }
            assert_response :success
          end

          test 'host ids as array of IDs' do
            host = FactoryBot.create(:host)
            host2 = FactoryBot.create(:host)
            @attrs[:host_ids] = [host.id, host2.id]
            post :create, params: { job_invocation: @attrs }
            assert_response :success
          end

          test 'search_query' do
            @attrs[:host_ids] = 'name = testfqdn'
            post :create, params: { job_invocation: @attrs }
            assert_response :success
          end
        end
      end

      describe '#output' do
        let(:host) { @invocation.targeting.hosts.first }

        test 'should provide output for delayed task' do
          ForemanTasks::Task.any_instance.expects(:scheduled?).returns(true)
          get :output, params: { :job_invocation_id => @invocation.id, :host_id => host.id }
          result = ActiveSupport::JSON.decode(@response.body)
          assert_equal result['delayed'], true
          assert_equal result['refresh'], true
          assert_equal result['output'], []
          assert_response :success
        end

        test 'should provide empty output for host which does not have a task yet' do
          JobInvocation.any_instance.expects(:sub_task_for_host).returns(nil)
          get :output, params: { :job_invocation_id => @invocation.id, :host_id => host.id }
          result = ActiveSupport::JSON.decode(@response.body)
          assert_equal result['refresh'], true
          assert_equal result['output'], []
          assert_response :success
        end

        test 'should fail with 404 for non-existing job invocation' do
          invocation_id = @invocation.id + 1
          assert_empty JobInvocation.where(:id => invocation_id)
          get :output, params: { :job_invocation_id => invocation_id, :host_id => 1234 }
          result = ActiveSupport::JSON.decode(@response.body)
          assert_equal result['message'], "Job invocation not found by id '#{invocation_id}'"
          assert_response :missing
        end

        test 'should get output only for host in job invocation' do
          get :output, params: { job_invocation_id: @invocation.id,
                                 host_id: FactoryBot.create(:host).id }
          assert_response :missing
        end
      end

      describe 'raw output' do
        let(:fake_output) do
          (1..5).map do |i|
            { 'timestamp' => (Time.now - (5 - i)).to_f, 'output' => "#{i}\n" }
          end
        end
        let(:fake_task) do
          OpenStruct.new :pending? => false, :main_action => OpenStruct.new(:live_output => fake_output)
        end
        let(:host) { @invocation.targeting.hosts.first }

        test 'should provide raw output for a host' do
          JobInvocation.any_instance.expects(:task).returns(OpenStruct.new(:scheduled? => false))
          JobInvocation.any_instance.expects(:sub_task_for_host).returns(fake_task)
          get :raw_output, params: { :job_invocation_id => @invocation.id, :host_id => host.id }
          result = ActiveSupport::JSON.decode(@response.body)
          assert_equal result['complete'], true
          assert_equal result['output'], (1..5).map(&:to_s).join("\n") + "\n"
          assert_response :success
        end

        test 'should provide raw output for delayed task' do
          start_time = Time.now
          JobInvocation.any_instance
                       .expects(:task).twice
                       .returns(OpenStruct.new(:scheduled? => true, :start_at => start_time))
          JobInvocation.any_instance.expects(:sub_task_for_host).never
          get :raw_output, params: { :job_invocation_id => @invocation.id, :host_id => host.id }
          result = ActiveSupport::JSON.decode(@response.body)
          assert_equal result['complete'], false
          assert_equal result['delayed'], true
          assert_nil result['output']
          _(Time.parse(result['start_at']).to_f).must_be_close_to start_time.to_f
          assert_response :success
        end

        test 'should provide raw output for host without task' do
          JobInvocation.any_instance.expects(:task).returns(OpenStruct.new(:scheduled? => false))
          JobInvocation.any_instance.expects(:sub_task_for_host)
          get :raw_output, params: { :job_invocation_id => @invocation.id, :host_id => host.id }
          result = ActiveSupport::JSON.decode(@response.body)
          assert_equal result['complete'], false
          assert_nil result['output']
          assert_response :success
        end

        test 'should get raw output only for host in job invocation' do
          get :raw_output, params: { job_invocation_id: @invocation.id,
                                     host_id: FactoryBot.create(:host).id }
          assert_response :missing
        end
      end

      test 'should cancel a job' do
        @invocation.task.expects(:cancellable?).returns(true)
        @invocation.task.expects(:cancel).returns(true)
        JobInvocation.expects(:from_param).with(@invocation.id.to_s).returns(@invocation)
        post :cancel, :params => { :id => @invocation.id }
        result = ActiveSupport::JSON.decode(@response.body)
        assert_equal result['cancelled'], true
        assert_equal result['id'], @invocation.id

        assert_response :success
      end

      test 'should abort a job' do
        @invocation.task.expects(:cancellable?).returns(true)
        @invocation.task.expects(:abort).returns(true)
        JobInvocation.expects(:from_param).with(@invocation.id.to_s).returns(@invocation)
        post :cancel, :params => { :id => @invocation.id, :force => true }
        result = ActiveSupport::JSON.decode(@response.body)
        assert_equal result['cancelled'], true
        assert_equal result['id'], @invocation.id

        assert_response :success
      end

      test 'should error when trying to cancel a stopped job' do
        @invocation.task.expects(:cancellable?).returns(false)
        JobInvocation.expects(:from_param).with(@invocation.id.to_s).returns(@invocation)
        post :cancel, :params => { :id => @invocation.id }
        assert_response 422
      end

      test 'should rerun' do
        JobInvocation.any_instance.expects(:generate_description)
        JobInvocationComposer.any_instance
                             .expects(:validate_job_category)
                             .with(@invocation.job_category)
                             .returns(@invocation.job_category)
        post :rerun, params: { :id => @invocation.id }
        assert_response :success
        result = ActiveSupport::JSON.decode(@response.body)
        targeting = Targeting.find(result['targeting_id'])
        _(targeting.user_id).must_equal users(:admin).id
        _(targeting.search_query).must_equal @invocation.targeting.search_query
      end

      test 'should not raise an exception when reruning failed has no hosts' do
        @invocation.targeting.hosts.first.destroy
        JobInvocation.any_instance.expects(:generate_description)
        JobInvocationComposer.any_instance
                             .expects(:validate_job_category)
                             .with(@invocation.job_category)
                             .returns(@invocation.job_category)

        post :rerun, params: { :id => @invocation.id, :failed_only => true }
        assert_response :success
        result = ActiveSupport::JSON.decode(@response.body)
        targeting = Targeting.find(result['targeting_id'])
        _(targeting.user_id).must_equal users(:admin).id
        _(targeting.search_query).must_equal 'name ^ ()'
      end

      test 'should rerun failed only' do
        @invocation = FactoryBot.create(:job_invocation, :with_template, :with_failed_task)
        @invocation.job_category = @invocation.pattern_template_invocations.first.template.job_category
        @invocation.targeting.hosts = @invocation.template_invocations.map(&:host)
        @invocation.save!
        JobInvocation.any_instance.expects(:generate_description)
        JobInvocationComposer.any_instance
                             .expects(:validate_job_category)
                             .with(@invocation.job_category)
                             .returns(@invocation.job_category)
        post :rerun, params: { :id => @invocation.id, :failed_only => true }
        assert_response :success
        result = ActiveSupport::JSON.decode(@response.body)
        targeting = Targeting.find(result['targeting_id'])
        hostnames = @invocation.template_invocations.map { |ti| ti.host.name }
        _(targeting.user_id).must_equal users(:admin).id
        _(targeting.search_query).must_equal "name ^ (#{hostnames.join(',')})"
      end

      test 'should return 404 if template is not found' do
        @invocation.job_category = 'Missing category'
        @invocation.save!
        post :rerun, params: { :id => @invocation.id }
        assert_response 404
      end
    end
  end
end
