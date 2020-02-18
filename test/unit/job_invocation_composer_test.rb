require 'test_plugin_helper'
RemoteExecutionProvider.register(:Ansible, OpenStruct)
RemoteExecutionProvider.register(:Mcollective, OpenStruct)

class JobInvocationComposerTest < ActiveSupport::TestCase
  before do
    setup_user('create', 'template_invocations')
    setup_user('view',   'job_templates', 'name ~ trying*')
    setup_user('create', 'job_templates', 'name ~ trying*')
    setup_user('view',   'job_invocations')
    setup_user('create', 'job_invocations')
    setup_user('view',   'bookmarks')
    setup_user('create', 'bookmarks')
    setup_user('edit',   'bookmarks')
    setup_user('view',   'hosts')
    setup_user('create', 'hosts')
  end

  let(:trying_job_template_1) { FactoryBot.create(:job_template, :job_category => 'trying_job_template_1', :name => 'trying1', :provider_type => 'SSH') }
  let(:trying_job_template_2) { FactoryBot.create(:job_template, :job_category => 'trying_job_template_2', :name => 'trying2', :provider_type => 'Mcollective') }
  let(:trying_job_template_3) { FactoryBot.create(:job_template, :job_category => 'trying_job_template_1', :name => 'trying3', :provider_type => 'SSH') }
  let(:unauthorized_job_template_1) { FactoryBot.create(:job_template, :job_category => 'trying_job_template_1', :name => 'unauth1', :provider_type => 'SSH') }
  let(:unauthorized_job_template_2) { FactoryBot.create(:job_template, :job_category => 'unauthorized_job_template_2', :name => 'unauth2', :provider_type => 'Ansible') }


  let(:input1) { FactoryBot.create(:template_input, :template => trying_job_template_1, :input_type => 'user') }
  let(:input2) { FactoryBot.create(:template_input, :template => trying_job_template_3, :input_type => 'user') }
  let(:input3) { FactoryBot.create(:template_input, :template => trying_job_template_1, :input_type => 'user', :required => true) }
  let(:unauthorized_input1) { FactoryBot.create(:template_input, :template => unauthorized_job_template_1, :input_type => 'user') }

  let(:ansible_params) { { } }
  let(:ssh_params) { { } }
  let(:mcollective_params) { { } }
  let(:providers_params) { { :providers => { :ansible => ansible_params, :ssh => ssh_params, :mcollective => mcollective_params } } }

  context 'with general new invocation and empty params' do
    let(:params) { {} }
    let(:composer) { JobInvocationComposer.from_ui_params(params) }

    describe '#available_templates' do
      it 'obeys authorization' do
        composer # lazy load composer before stubbing
        JobTemplate.expects(:authorized).with(:view_job_templates).returns(JobTemplate.where({}))
        composer.available_templates
      end
    end

    context 'job templates exist' do
      before do
        trying_job_template_1
        trying_job_template_2
        trying_job_template_3
        unauthorized_job_template_1
        unauthorized_job_template_2
      end

      describe '#available_templates_for(job_category)' do
        it 'find the templates only for a given job name' do
          results = composer.available_templates_for(trying_job_template_1.job_category)
          results.must_include trying_job_template_1
          results.wont_include trying_job_template_2
        end

        it 'it respects view permissions' do
          results = composer.available_templates_for(trying_job_template_1.job_category)
          results.wont_include unauthorized_job_template_1
        end
      end

      describe '#available_job_categories' do
        let(:job_categories) { composer.available_job_categories }

        it 'find only job names that user is granted to view' do
          job_categories.must_include trying_job_template_1.job_category
          job_categories.must_include trying_job_template_2.job_category
          job_categories.wont_include unauthorized_job_template_2.job_category
        end

        it 'every job name is listed just once' do
          job_categories.uniq.must_equal job_categories
        end
      end

      describe '#available_provider_types' do
        let(:provider_types) { composer.available_provider_types }

        it 'finds only providers which user is granted to view' do
          composer.job_invocation.job_category = 'trying_job_template_1'
          provider_types.must_include 'SSH'
          provider_types.wont_include 'Mcollective'
          provider_types.wont_include 'Ansible'
        end

        it 'every provider type is listed just once' do
          provider_types.uniq.must_equal provider_types
        end
      end

      describe '#available_template_inputs' do
        before do
          input1
          input2
          unauthorized_input1
        end

        it 'returns only authorized inputs based on templates' do
          composer.available_template_inputs.must_include(input1)
          composer.available_template_inputs.must_include(input2)
          composer.available_template_inputs.wont_include(unauthorized_input1)
        end

        context 'params contains job template ids' do
          let(:ssh_params) { { :job_template_id => trying_job_template_1.id.to_s } }
          let(:ansible_params) { { :job_template_id => '' } }
          let(:mcollective_params) { { :job_template_id => '' } }
          let(:params) { { :job_invocation => providers_params }.with_indifferent_access }

          it 'finds the inputs only specified job templates' do
            composer.available_template_inputs.must_include(input1)
            composer.available_template_inputs.wont_include(input2)
            composer.available_template_inputs.wont_include(unauthorized_input1)
          end
        end
      end

      describe '#needs_provider_type_selection?' do
        it 'returns true if there are more than one providers respecting authorization' do
          composer.stubs(:available_provider_types => [ 'SSH', 'Ansible' ])
          assert composer.needs_provider_type_selection?
        end

        it 'returns false if there is one provider' do
          composer.stubs(:available_provider_types => [ 'SSH' ])
          assert_not composer.needs_provider_type_selection?
        end
      end

      describe '#displayed_provider_types' do
        # nothing to test yet
      end

      describe '#templates_for_provider(provider_type)' do
        it 'returns all templates for a given provider respecting template permissions' do
          trying_job_template_4 = FactoryBot.create(:job_template, :job_category => 'trying_job_template_1', :name => 'trying4', :provider_type => 'Ansible')
          result = composer.templates_for_provider('SSH')
          result.must_include trying_job_template_1
          result.must_include trying_job_template_3
          result.wont_include unauthorized_job_template_1
          result.wont_include trying_job_template_4

          result = composer.templates_for_provider('Ansible')
          result.wont_include trying_job_template_1
          result.wont_include trying_job_template_3
          result.wont_include unauthorized_job_template_2
          result.must_include trying_job_template_4
        end
      end

      describe '#rerun_possible?' do
        it 'is true when not rerunning' do
          composer.must_be :rerun_possible?
        end

        it 'is true when rerunning with pattern tempalte invocations' do
          composer.expects(:reruns).returns(1)
          composer.job_invocation.expects(:pattern_template_invocations).returns([1])
          composer.must_be :rerun_possible?
        end

        it 'is false when rerunning without pattern template invocations' do
          composer.expects(:reruns).returns(1)
          composer.job_invocation.expects(:pattern_template_invocations).returns([])
          composer.wont_be :rerun_possible?
        end
      end

      describe '#selected_job_templates' do
        it 'returns no template if none was selected through params' do
          composer.selected_job_templates.must_be_empty
        end

        context 'extra unavailable templates id were selected' do
          let(:unauthorized) { FactoryBot.create(:job_template, :job_category => 'trying_job_template_1', :name => 'unauth3', :provider_type => 'Ansible') }
          let(:mcollective_authorized) { FactoryBot.create(:job_template, :job_category => 'trying_job_template_1', :name => 'trying4', :provider_type => 'Mcollective') }
          let(:ssh_params) { { :job_template_id => trying_job_template_1.id.to_s } }
          let(:ansible_params) { { :job_template_id => unauthorized.id.to_s } }
          let(:mcollective_params) { { :job_template_id => mcollective_authorized.id.to_s } }
          let(:params) { { :job_invocation => providers_params }.with_indifferent_access }

          it 'ignores unauthorized template' do
            unauthorized # make sure unautorized exists
            composer.selected_job_templates.wont_include unauthorized
          end

          it 'contains only authorized template specified in params' do
            mcollective_authorized # make sure mcollective_authorized exists
            composer.selected_job_templates.must_include trying_job_template_1
            composer.selected_job_templates.must_include mcollective_authorized
            composer.selected_job_templates.wont_include trying_job_template_3
          end
        end
      end

      describe '#preselected_template_for_provider(provider_type)' do
        context 'none template was selected through params' do
          it 'returns nil' do
            composer.preselected_template_for_provider('SSH').must_be_nil
          end
        end

        context 'available template was selected for a specified provider through params' do
          let(:ssh_params) { { :job_template_id => trying_job_template_1.id.to_s } }
          let(:params) { { :job_invocation => providers_params }.with_indifferent_access }

          it 'returns the selected template because it is available for provider' do
            composer.preselected_template_for_provider('SSH').must_equal trying_job_template_1
          end
        end
      end

      describe '#pattern template_invocations' do
        let(:ssh_params) do
          { :job_template_id => trying_job_template_1.id.to_s,
            :job_templates => {
              trying_job_template_1.id.to_s => {
                :input_values => { input1.id.to_s => { :value => 'value1' }, unauthorized_input1.id.to_s => { :value => 'dropped' } }
              }
            }}
        end
        let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }
        let(:invocations) { composer.pattern_template_invocations }

        it 'builds pattern template invocations based on passed params and it filters out wrong inputs' do
          invocations.size.must_equal 1
          invocations.first.input_values.size.must_equal 1
          invocations.first.input_values.first.value.must_equal 'value1'
        end
      end

      describe '#effective_user' do
        let(:ssh_params) do
          { :job_template_id => trying_job_template_1.id.to_s,
            :job_templates => {
              trying_job_template_1.id.to_s => {
                :effective_user => invocation_effective_user
              }
            }}
        end
        let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }
        let(:template_invocation) do
          trying_job_template_1.effective_user.update_attributes(:overridable => overridable, :value => 'template user')
          composer.pattern_template_invocations.first
        end

        before do
          Setting::RemoteExecution.load_defaults
        end

        context 'when overridable and provided' do
          let(:overridable) { true }
          let(:invocation_effective_user) { 'invocation user' }

          it 'takes the value from the template invocation' do
            template_invocation.effective_user.must_equal 'invocation user'
          end
        end

        context 'when overridable and not provided' do
          let(:overridable) { true }
          let(:invocation_effective_user) { '' }

          it 'takes the value from the job template' do
            template_invocation.effective_user.must_equal 'template user'
          end
        end

        context 'when not overridable and provided' do
          let(:overridable) { false }
          let(:invocation_effective_user) { 'invocation user' }

          it 'takes the value from the job template' do
            template_invocation.effective_user.must_equal 'template user'
          end
        end
      end

      describe '#displayed_search_query' do
        it 'is empty by default' do
          composer.displayed_search_query.must_be_empty
        end

        let(:host) { FactoryBot.create(:host) }
        let(:bookmark) { Bookmark.create!(:query => 'b', :name => 'bookmark', :public => true, :controller => 'hosts') }

        context 'all targetings parameters are present' do
          let(:params) { { :targeting => { :search_query => 'a', :bookmark_id => bookmark.id }, :host_ids => [ host.id ] }.with_indifferent_access }

          it 'explicit search query has highest priority' do
            composer.displayed_search_query.must_equal 'a'
          end
        end

        context 'host ids and bookmark are present' do
          let(:params) { { :targeting => { :bookmark_id => bookmark.id }, :host_ids => [ host.id ] }.with_indifferent_access }

          it 'hosts will be used instead of a bookmark' do
            composer.displayed_search_query.must_include host.name
          end
        end

        context 'bookmark is present' do
          let(:params) { { :targeting => { :bookmark_id => bookmark.id } }.with_indifferent_access }

          it 'bookmark query is used if it is available for the user' do
            bookmark.update_attribute :public, false
            composer.displayed_search_query.must_equal bookmark.query
          end

          it 'bookmark query is used if the bookmark is public' do
            bookmark.owner = nil
            bookmark.save(:validate => false) # skip validations so owner remains nil
            composer.displayed_search_query.must_equal bookmark.query
          end

          it 'empty search is returned if bookmark is not owned by the user and is not public' do
            bookmark.public = false
            bookmark.owner = nil
            bookmark.save(:validate => false) # skip validations so owner remains nil
            composer.displayed_search_query.must_be_empty
          end
        end
      end

      describe '#available_bookmarks' do
        it 'obeys authorization' do
          composer
          Bookmark.expects(:authorized).with(:view_bookmarks).returns(Bookmark.where({}))
          composer.available_bookmarks
        end

        context 'there are hostgroups and hosts bookmark' do
          let(:hostgroups) { Bookmark.create(:name => 'hostgroups', :query => 'name = x', :controller => 'hostgroups') }
          let(:hosts) { Bookmark.create(:name => 'hosts', :query => 'name = x', :controller => 'hosts') }
          let(:dashboard) { Bookmark.create(:name => 'dashboard', :query => 'name = x', :controller => 'dashboard') }

          it 'finds only host related bookmarks' do
            hosts
            dashboard
            hostgroups
            composer.available_bookmarks.must_include hosts
            composer.available_bookmarks.must_include dashboard
            composer.available_bookmarks.wont_include hostgroups
          end
        end
      end

      describe '#targeted_hosts_count' do
        let(:host) { FactoryBot.create(:host) }

        it 'obeys authorization' do
          composer.stubs(:displayed_search_query => "name = #{host.name}")
          Host.expects(:authorized).with(:view_hosts, Host).returns(Host.where({}))
          composer.targeted_hosts_count
        end

        it 'searches hosts based on displayed_search_query' do
          composer.stubs(:displayed_search_query => "name = #{host.name}")
          composer.targeted_hosts_count.must_equal 1
        end

        it 'returns 0 for queries with syntax errors' do
          composer.stubs(:displayed_search_query => 'name = ')
          composer.targeted_hosts_count.must_equal 0
        end

        it 'returns 0 when no query is present' do
          composer.stubs(:displayed_search_query => '')
          composer.targeted_hosts_count.must_equal 0
        end
      end

      describe '#input_value_for(input)' do
        let(:value1) { composer.input_value_for(input1) }
        it 'returns new empty input value if there is no invocation' do
          assert value1.new_record?
          value1.value.must_be_empty
        end

        context 'there are invocations without input values for a given input' do
          let(:ssh_params) do
            { :job_template_id => trying_job_template_1.id.to_s,
              :job_templates => {
                trying_job_template_1.id.to_s => {
                  :input_values => { }
                }
              } }
          end
          let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }

          it 'returns new empty input value' do
            assert value1.new_record?
            value1.value.must_be_empty
          end
        end

        context 'there are invocations with input values for a given input' do
          let(:ssh_params) do
            { :job_template_id => trying_job_template_1.id.to_s,
              :job_templates => {
                trying_job_template_1.id.to_s => {
                  :input_values => { input1.id.to_s => { :value => 'value1' } }
                }
              } }
          end
          let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }

          it 'finds the value among template invocations' do
            value1.value.must_equal 'value1'
          end
        end
      end

      describe '#valid?' do
        let(:host) { FactoryBot.create(:host) }
        let(:ssh_params) do
          { :job_template_id => trying_job_template_1.id.to_s,
            :job_templates => {
              trying_job_template_1.id.to_s => {
                :input_values => { input1.id.to_s => { :value => 'value1' } }
              }
            } }
        end

        let(:params) do
          { :job_invocation => { :providers => { :ssh => ssh_params } }, :targeting => { :search_query => "name = #{host.name}" } }.with_indifferent_access
        end

        it 'validates all associated objects even if some of the is invalid' do
          composer
          composer.job_invocation.expects(:valid?).returns(false)
          composer.targeting.expects(:valid?).returns(false)
          composer.pattern_template_invocations.each { |invocation| invocation.expects(:valid?).returns(false) }
          assert_not composer.valid?
        end
      end

      describe 'concurrency control' do

        describe 'with concurrency control set' do
          let(:params) do
            { :job_invocation => { :providers => { :ssh => ssh_params }, :concurrency_level => '5', :time_span => '60' } }.with_indifferent_access
          end

          it 'accepts the concurrency options' do
            composer.job_invocation.concurrency_level.must_equal 5
            composer.job_invocation.time_span.must_equal 60
          end
        end

        it 'can be disabled' do
          composer.job_invocation.concurrency_level.must_be_nil
          composer.job_invocation.time_span.must_be_nil
        end
      end

      describe 'triggering' do
        let(:params) do
          { :job_invocation => { :providers => { :ssh => ssh_params } }, :triggering => { :mode => 'future', :end_time=> {"end_time(3i)": 1, "end_time(2i)": 2, "end_time(1i)": 3, "end_time(4i)": 4, "end_time(5i)": 5} }}.with_indifferent_access
        end

        it 'accepts the triggering params' do
          composer.job_invocation.triggering.mode.must_equal :future
        end

        it 'formats the triggering end time when its unordered' do
          composer.job_invocation.triggering.end_time.must_equal Time.local(3,2,1,4,5)
        end
      end

      describe '#save' do
        it 'triggers save on job_invocation if it is valid' do
          composer.stubs(:valid? => true)
          composer.job_invocation.expects(:save)
          composer.save
        end

        it 'does not trigger save on job_invocation if it is invalid' do
          composer.stubs(:valid? => false)
          composer.job_invocation.expects(:save).never
          composer.save
        end
      end

      describe '#job_category' do
        it 'triggers job_category on job_invocation' do
          composer
          composer.job_invocation.expects(:job_category)
          composer.job_category
        end
      end

      describe '#password' do
        let(:password) { 'changeme' }
        let(:params) do
          { :job_invocation => { :password => password }}.with_indifferent_access
        end

        it 'sets the password properly' do
          composer
          composer.job_invocation.password.must_equal password
        end
      end

      describe '#key_passphrase' do
        let(:key_passphrase) { 'changeme' }
        let(:params) do
          { :job_invocation => { :key_passphrase => key_passphrase }}
        end

        it 'sets the key passphrase properly' do
          composer
          composer.job_invocation.key_passphrase.must_equal key_passphrase
        end
      end

      describe '#sudo_password' do
        let(:sudo_password) { 'password' }
        let(:params) do
          { :job_invocation => { :sudo_password => sudo_password }}
        end

        it 'sets the sudo password properly' do
          composer
          composer.job_invocation.sudo_password.must_equal sudo_password
        end
      end

      describe '#targeting' do
        it 'triggers targeting on job_invocation' do
          composer
          composer.job_invocation.expects(:targeting)
          composer.targeting
        end
      end

      describe '#compose_from_invocation(existing_invocation)' do
        let(:host) { FactoryBot.create(:host) }
        let(:ssh_params) do
          { :job_template_id => trying_job_template_1.id.to_s,
            :job_templates => {
              trying_job_template_1.id.to_s => {
                :input_values => { input1.id.to_s => { :value => 'value1' } }
              }
            } }
        end
        let(:params) do
          {
            :job_invocation => {
              :providers => { :ssh => ssh_params },
              :concurrency_level => 5,
              :time_span => 60,
            },
            :targeting => {
              :search_query => "name = #{host.name}",
              :targeting_type => Targeting::STATIC_TYPE
            }
          }.with_indifferent_access
        end
        let(:existing) { composer.job_invocation }
        let(:new_composer) { JobInvocationComposer.from_job_invocation(composer.job_invocation) }

        before do
          composer.save
        end

        it 'sets the same job name' do
          new_composer.job_category.must_equal existing.job_category
        end

        it 'accepts additional host ids' do
          new_composer = JobInvocationComposer.from_job_invocation(composer.job_invocation, { :host_ids => [host.id] })
          new_composer.search_query.must_equal("name ^ (#{host.name})")
        end

        it 'builds new targeting object which keeps search query' do
          new_composer.targeting.wont_equal existing.targeting
          new_composer.search_query.must_equal existing.targeting.search_query
        end

        it 'keeps job template ids' do
          new_composer.job_template_ids.must_equal existing.pattern_template_invocations.map(&:template_id)
        end

        it 'keeps template invocations and their values' do
          new_composer.pattern_template_invocations.size.must_equal existing.pattern_template_invocations.size
        end

        it 'sets the same concurrency control options' do
          new_composer.job_invocation.concurrency_level.must_equal existing.concurrency_level
          new_composer.job_invocation.time_span.must_equal existing.time_span
        end

      end
    end
  end

  describe '#from_api_params' do
    let(:composer) { JobInvocationComposer.from_api_params(params) }
    let(:bookmark) { bookmarks(:one) }

    context 'with targeting from bookmark' do

      before do
        [trying_job_template_1, trying_job_template_3] # mentioning templates we want to have initialized in the test
      end

      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :targeting_type => 'static_query',
          :bookmark_id => bookmark.id }
      end

      it 'creates invocation with a bookmark' do
        assert composer.save!
        assert_equal bookmark, composer.job_invocation.targeting.bookmark
        assert_equal composer.job_invocation.targeting.user, User.current
        assert_not_empty composer.job_invocation.pattern_template_invocations
      end
    end

    context 'with targeting from search query' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :targeting_type => 'static_query',
          :search_query => 'some hosts' }
      end

      it 'creates invocation with a search query' do
        assert composer.save!
        assert_equal 'some hosts', composer.job_invocation.targeting.search_query
        assert_not_empty composer.job_invocation.pattern_template_invocations
      end
    end

    context 'with with inputs' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :inputs => {input1.name => 'some_value'}}
      end

      it 'finds the inputs by name' do
        assert composer.save!
        assert_equal 1, composer.pattern_template_invocations.first.input_values.collect.count
      end
    end

    context 'with effective user' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :effective_user => 'invocation user',
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :inputs => {input1.name => 'some_value'}}
      end

      let(:template_invocation) { composer.job_invocation.pattern_template_invocations.first }

      it 'sets the effective user based on the input' do
        assert composer.save!
        template_invocation.effective_user.must_equal 'invocation user'
      end
    end

    context 'with concurrency_control' do
      let(:level) { 5 }
      let(:time_span) { 60 }
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :concurrency_control => {
            :concurrency_level => level,
            :time_span => time_span
          },
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :inputs => { input1.name => 'some_value' } }
      end

      it 'sets the concurrency level and time span based on the input' do
        assert composer.save!
        composer.job_invocation.time_span.must_equal time_span
        composer.job_invocation.concurrency_level.must_equal level
      end
    end

    context 'with rex feature defined' do
      let(:feature) { FactoryBot.create(:remote_execution_feature) }
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :remote_execution_feature_id => feature.id,
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :inputs => { input1.name => 'some_value' } }
      end

      it 'sets the remote execution feature based on the input' do
        assert composer.save!
        composer.job_invocation.remote_execution_feature.must_equal feature
      end
    end

    context 'with invalid targeting' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :search_query => 'some hosts',
          :inputs => {input1.name => 'some_value'}}
      end

      it 'handles errors' do
        assert_raises(ActiveRecord::RecordNotSaved) do
          composer.save!
        end
      end
    end

    context 'with invalid bookmark and search query' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :bookmark_id => bookmark.id,
          :inputs => {input1.name => 'some_value'}}
      end

      it 'handles errors' do
        assert_raises(Foreman::Exception) do
          JobInvocationComposer.from_api_params(params)
        end
      end
    end

    context 'with invalid inputs' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :inputs => {input3.name => nil}}
      end

      it 'handles errors' do
        error = assert_raises(ActiveRecord::RecordNotSaved) do
          composer.save!
        end
        error.message.must_include "Template #{trying_job_template_1.name}: Input #{input3.name.downcase}: Value can't be blank"
      end
    end

    context 'with empty values for non-required inputs' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :inputs => {input3.name => 'some value'}}
      end

      it 'accepts the params' do
        composer.save!
        assert_not composer.job_invocation.new_record?
      end
    end

    context 'with missing required inputs' do
      let(:params) do
        { :job_category => trying_job_template_1.job_category,
          :job_template_id => trying_job_template_1.id,
          :targeting_type => 'static_query',
          :search_query => 'some hosts',
          :inputs => {input1.name => 'some_value'}}
      end

      it 'handles errors' do
        input3.must_be :required

        error = assert_raises(ActiveRecord::RecordNotSaved) do
          composer.save!
        end

        error.message.must_include "Template #{trying_job_template_1.name}: Not all required inputs have values. Missing inputs: #{input3.name}"
      end
    end
  end

  describe '#from_job_invocation' do
    let(:job_invocation) do
      as_admin { FactoryBot.create(:job_invocation, :with_template, :with_task) }
    end

    before do
      job_invocation.targeting.host_ids = job_invocation.template_invocations_host_ids
    end

    it 'marks targeting as resolved if static' do
      created = JobInvocationComposer.from_job_invocation(job_invocation).job_invocation
      assert created.targeting.resolved?
      assert_equal job_invocation.template_invocations_host_ids, created.targeting.host_ids
    end

    it 'takes randomized_ordering from the original job invocation when rerunning failed' do
      job_invocation.targeting.randomized_ordering = true
      job_invocation.targeting.save!
      host_ids = job_invocation.targeting.hosts.pluck(:id)
      composer = JobInvocationComposer.from_job_invocation(job_invocation, :host_ids => host_ids)
      assert composer.job_invocation.targeting.randomized_ordering
    end
  end

  describe '#resolve_job_category and #resolve job_templates' do
    let(:setting_template) { as_admin { FactoryBot.create(:job_template, :name => 'trying setting', :job_category => 'fluff') } }
    let(:other_template) { as_admin { FactoryBot.create(:job_template, :name => 'trying something', :job_category => 'fluff') } }
    let(:second_template) { as_admin { FactoryBot.create(:job_template, :name => 'second template', :job_category => 'fluff') } }
    let(:params) { { :host_ids => nil, :targeting => { :targeting_type => "static_query", :bookmark_id => nil }, :job_template_id => setting_template.id } }
    let(:composer) { JobInvocationComposer.from_api_params(params) }

    context 'with template in setting present' do
      before do
        FactoryBot.create(
          :setting,
          :name => 'remote_execution_form_job_template',
          :category => 'Setting::RemoteExecution',
          :value => setting_template.name
        )
      end

      it 'should resolve category to the setting value' do
        assert_equal setting_template.job_category, composer.resolve_job_category('foo')
      end

      it 'should resolve template to the setting value' do
        assert_equal setting_template, composer.resolve_job_template([other_template, setting_template])
      end

      it 'should respect provider templates when resolving templates' do
        assert_equal other_template, composer.resolve_job_template([other_template])
      end
    end

    context 'with template in setting absent' do
      it 'should resolve category to the default value' do
        category = 'foo'
        assert_equal category, composer.resolve_job_category(category)
      end

      it 'should resolve template to the first in category' do
        assert_equal other_template, composer.resolve_job_template([other_template, second_template])
      end
    end
  end
end
