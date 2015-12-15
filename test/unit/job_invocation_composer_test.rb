require 'test_plugin_helper'
RemoteExecutionProvider.register(:Ansible, OpenStruct)
RemoteExecutionProvider.register(:Mcollective, OpenStruct)

describe JobInvocationComposer do
  before do
    permission1 = FactoryGirl.create(:permission, :name => 'view_job_templates', :resource_type => 'JobTemplate')
    permission2 = Permission.find_by_name('view_bookmarks')
    permission3 = Permission.find_by_name('view_hosts')
    filter1 = FactoryGirl.build(:filter, :permissions => [permission1], :search => 'name ~ testing*')
    filter2 = FactoryGirl.build(:filter, :permissions => [permission2])
    filter3 = FactoryGirl.build(:filter, :permissions => [permission3])
    filter1.save
    filter2.save
    filter3.save
    role = FactoryGirl.build(:role)
    role.filters = filter1, filter2, filter3
    role.save
    User.current = FactoryGirl.build(:user)
    User.current.roles<< role
    User.current.save
  end

  let(:testing_job_template_1) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing1', :provider_type => 'Ssh') }
  let(:testing_job_template_2) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_2', :name => 'testing2', :provider_type => 'Mcollective') }
  let(:testing_job_template_3) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing3', :provider_type => 'Ssh') }
  let(:unauthorized_job_template_1) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'unauth1', :provider_type => 'Ssh') }
  let(:unauthorized_job_template_2) { FactoryGirl.create(:job_template, :job_name => 'unauthorized_job_template_2', :name => 'unauth2', :provider_type => 'Ansible') }


  let(:input1) { FactoryGirl.create(:template_input, :template => testing_job_template_1, :input_type => 'user') }
  let(:input2) { FactoryGirl.create(:template_input, :template => testing_job_template_3, :input_type => 'user') }
  let(:input3) { FactoryGirl.create(:template_input, :template => testing_job_template_1, :input_type => 'user', :required => true) }
  let(:unauthorized_input1) { FactoryGirl.create(:template_input, :template => unauthorized_job_template_1, :input_type => 'user') }

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
        JobTemplate.expects(:authorized).with(:view_job_templates).returns(JobTemplate.scoped)
        composer.available_templates
      end
    end

    context 'job templates exist' do
      before do
        testing_job_template_1
        testing_job_template_2
        testing_job_template_3
        unauthorized_job_template_1
        unauthorized_job_template_2
      end

      describe '#available_templates_for(job_name)' do
        it 'find the templates only for a given job name' do
          results = composer.available_templates_for(testing_job_template_1.job_name)
          results.must_include testing_job_template_1
          results.wont_include testing_job_template_2
        end

        it 'it respects view permissions' do
          results = composer.available_templates_for(testing_job_template_1.job_name)
          results.wont_include unauthorized_job_template_1
        end
      end

      describe '#available_job_names' do
        let(:job_names) { composer.available_job_names }

        it 'find only job names that user is granted to view' do
          job_names.must_include testing_job_template_1.job_name
          job_names.must_include testing_job_template_2.job_name
          job_names.wont_include unauthorized_job_template_2.job_name
        end

        it 'every job name is listed just once' do
          job_names.uniq.must_equal job_names
        end
      end

      describe '#available_provider_types' do
        let(:provider_types) { composer.available_provider_types }

        it 'finds only providers which user is granted to view' do
          composer.job_invocation.job_name = 'testing_job_template_1'
          provider_types.must_include 'Ssh'
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
          let(:ssh_params) { { :job_template_id => testing_job_template_1.id.to_s } }
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
          composer.stubs(:available_provider_types => [ 'Ssh', 'Ansible' ])
          assert composer.needs_provider_type_selection?
        end

        it 'returns false if there is one provider' do
          composer.stubs(:available_provider_types => [ 'Ssh' ])
          refute composer.needs_provider_type_selection?
        end
      end

      describe '#only_one_template_available?' do
        context 'composer needs provider type selection' do
          before { composer.stubs(:needs_provider_type_selection? => true) }

          it 'returns false because it means we have at least two providers so we need to be able to disable it per provider' do
            refute composer.only_one_template_available?
          end
        end

        context 'composer does not need provider type selection' do
          before { composer.stubs(:needs_provider_type_selection? => false) }

          it 'returns true if there is only one template for the provider' do
            composer.stubs(:templates_for_provider => [ testing_job_template_1 ])
            assert composer.only_one_template_available?
          end

          it 'returns false if there is more than one template for the provider' do
            composer.stubs(:templates_for_provider => [ testing_job_template_1, testing_job_template_3 ])
            refute composer.only_one_template_available?
          end
        end
      end

      describe '#displayed_provider_types' do
        # nothing to test yet
      end

      describe '#templates_for_provider(provider_type)' do
        it 'returns all templates for a given provider respecting template permissions' do
          testing_job_template_4 = FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing4', :provider_type => 'Ansible')
          result = composer.templates_for_provider('Ssh')
          result.must_include testing_job_template_1
          result.must_include testing_job_template_3
          result.wont_include unauthorized_job_template_1
          result.wont_include testing_job_template_4

          result = composer.templates_for_provider('Ansible')
          result.wont_include testing_job_template_1
          result.wont_include testing_job_template_3
          result.wont_include unauthorized_job_template_2
          result.must_include testing_job_template_4
        end
      end

      describe '#selected_job_templates' do
        it 'returns no template if none was selected through params' do
          composer.selected_job_templates.must_be_empty
        end

        context 'extra unavailable templates id were selected' do
          let(:unauthorized) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'unauth3', :provider_type => 'Ansible') }
          let(:mcollective_authorized) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing4', :provider_type => 'Mcollective') }
          let(:ssh_params) { { :job_template_id => testing_job_template_1.id.to_s } }
          let(:ansible_params) { { :job_template_id => unauthorized.id.to_s } }
          let(:mcollective_params) { { :job_template_id => mcollective_authorized.id.to_s } }
          let(:params) { { :job_invocation => providers_params }.with_indifferent_access }

          it 'ignores unauthorized template' do
            unauthorized # make sure unautorized exists
            composer.selected_job_templates.wont_include unauthorized
          end

          it 'contains only authorized template specified in params' do
            mcollective_authorized # make sure mcollective_authorized exists
            composer.selected_job_templates.must_include testing_job_template_1
            composer.selected_job_templates.must_include mcollective_authorized
            composer.selected_job_templates.wont_include testing_job_template_3
          end
        end
      end

      describe '#preselect_disabled_for_provider(provider_type)' do
        context 'none template was selected through params' do
          it 'returns true since nothing was selected and disabled is default' do
            assert composer.preselect_disabled_for_provider('Ssh')
          end
        end

        context 'available template was selected for a specified provider through params' do
          let(:ssh_params) { { :job_template_id => testing_job_template_1.id.to_s } }
          let(:params) { { :job_invocation => providers_params }.with_indifferent_access }

          it 'returns false because available template was selected' do
            refute composer.preselect_disabled_for_provider('Ssh')
          end
        end
      end

      describe '#template_invocations' do
        let(:ssh_params) do
          { :job_template_id => testing_job_template_1.id.to_s,
            :job_templates => {
              testing_job_template_1.id.to_s => {
                :input_values => { input1.id.to_s => { :value => 'value1' },  unauthorized_input1.id.to_s => { :value => 'dropped' } }
              }
            }
          }
        end
        let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }
        let(:invocations) { composer.template_invocations }

        it 'builds template invocations based on passed params and it filters out wrong inputs' do
          invocations.size.must_equal 1
          invocations.first.input_values.size.must_equal 1
          invocations.first.input_values.first.value.must_equal 'value1'
        end
      end

      describe '#effective_user' do
        let(:ssh_params) do
          { :job_template_id => testing_job_template_1.id.to_s,
            :job_templates => {
              testing_job_template_1.id.to_s => {
                :effective_user => invocation_effective_user
              }
            }
          }
        end
        let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }
        let(:template_invocation) do
          testing_job_template_1.effective_user.update_attributes(:overridable => overridable, :value => 'template user')
          composer.template_invocations.first
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
          let(:invocation_effective_user) { "" }

          it 'takes the value from the job template' do
            template_invocation.effective_user.must_equal 'template user'
          end
        end

        context 'when not overridable and provided' do
          let(:overridable) { false }
          let(:invocation_effective_user) { "invocation user" }

          it 'takes the value from the job template' do
            template_invocation.effective_user.must_equal 'template user'
          end
        end
      end

      describe '#displayed_search_query' do
        it 'is empty by default' do
          composer.displayed_search_query.must_be_empty
        end

        let(:host) { FactoryGirl.create(:host) }
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
          Bookmark.expects(:authorized).with(:view_bookmarks).returns(Bookmark.scoped)
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
        let(:host) { FactoryGirl.create(:host) }

        it 'obeys authorization' do
          composer.stubs(:displayed_search_query => "name = #{host.name}")
          Host.expects(:authorized).with(:view_hosts, Host).returns(Host.scoped)
          composer.targeted_hosts_count
        end

        it 'searches hosts based on displayed_search_query' do
          composer.stubs(:displayed_search_query => "name = #{host.name}")
          composer.targeted_hosts_count.must_equal 1
        end

        it 'returns 0 for queries with syntax errors' do
          composer.stubs(:displayed_search_query => "name = ")
          composer.targeted_hosts_count.must_equal 0
        end

        it 'returns 0 when no query is present' do
          composer.stubs(:displayed_search_query => '')
          composer.targeted_hosts_count.must_equal 0
        end
      end

      describe '#template_invocation_input_value_for(input)' do
        let(:value1) { composer.template_invocation_input_value_for(input1) }
        it 'returns new empty input value if there is no invocation' do
          assert value1.new_record?
          value1.value.must_be_empty
        end

        context 'there are invocations without input values for a given input' do
          let(:ssh_params) do
            { :job_template_id => testing_job_template_1.id.to_s,
              :job_templates => {
                testing_job_template_1.id.to_s => {
                  :input_values => { }
                } } }
          end
          let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }

          it 'returns new empty input value' do
            assert value1.new_record?
            value1.value.must_be_empty
          end
        end

        context 'there are invocations with input values for a given input' do
          let(:ssh_params) do
            { :job_template_id => testing_job_template_1.id.to_s,
              :job_templates => {
                testing_job_template_1.id.to_s => {
                  :input_values => { input1.id.to_s => { :value => 'value1' } }
                } } }
          end
          let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }

          it 'finds the value among template invocations' do
            value1.value.must_equal 'value1'
          end
        end
      end

      describe '#valid?' do
        let(:host) { FactoryGirl.create(:host) }
        let(:ssh_params) do
          { :job_template_id => testing_job_template_1.id.to_s,
            :job_templates => {
              testing_job_template_1.id.to_s => {
                :input_values => { input1.id.to_s => { :value => 'value1' } }
              } } }
        end
        let(:params) do
          { :job_invocation => { :providers => { :ssh => ssh_params } }, :targeting => { :search_query => "name = #{host.name}" } }.with_indifferent_access
        end

        it 'validates all associated objects even if some of the is invalid' do
          composer
          composer.job_invocation.expects(:valid?).returns(false)
          composer.targeting.expects(:valid?).returns(false)
          composer.template_invocations.each { |invocation| invocation.expects(:valid?).returns(false) }
          refute composer.valid?
        end
      end

      describe 'triggering' do
        let(:params) do
          { :job_invocation => { :providers => { :ssh => ssh_params } }, :triggering => { :mode => 'future' }}.with_indifferent_access
        end

        it 'accepts the triggering params' do
          composer.job_invocation.triggering.mode.must_equal :future
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

      describe '#job_name' do
        it 'triggers job_name on job_invocation' do
          composer
          composer.job_invocation.expects(:job_name)
          composer.job_name
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
        let(:host) { FactoryGirl.create(:host) }
        let(:ssh_params) do
          { :job_template_id => testing_job_template_1.id.to_s,
            :job_templates => {
              testing_job_template_1.id.to_s => {
                :input_values => { input1.id.to_s => { :value => 'value1' } }
              } } }
        end
        let(:params) do
          {
            :job_invocation => {
              :providers => { :ssh => ssh_params }
            },
            :targeting => {
              :search_query => "name = #{host.name}",
              :targeting_type => Targeting::STATIC_TYPE
            }
          }.with_indifferent_access
        end
        let(:existing) { composer.job_invocation.reload }
        let(:new_job_invocation) { JobInvocation.new }
        let(:new_composer) { JobInvocationComposer.from_job_invocation(composer.job_invocation) }

        before do
          composer.save
        end

        it 'sets the same job name' do
          new_composer.job_name.must_equal existing.job_name
        end

        it 'builds new targeting object which keeps search query' do
          new_composer.targeting.wont_equal existing.targeting
          new_composer.search_query.must_equal existing.targeting.search_query
        end

        it 'keeps job template ids' do
          new_composer.job_template_ids.must_equal existing.template_invocations.map(&:template_id)
        end

        it 'keeps template invocations and their values' do
          new_composer.template_invocations.size.must_equal existing.template_invocations.size
        end

      end
    end
  end

  describe '#from_api_params' do
    let(:composer) { JobInvocationComposer.from_api_params(params) }
    let(:bookmark) { bookmarks(:one) }

    context 'with targeting from bookmark' do

      before do
        [testing_job_template_1, testing_job_template_3] # mentioning templates we want to have initialized in the test
      end

      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :targeting_type => "static_query",
          :bookmark_id => bookmark.id }
      end

      it "creates invocation with a bookmark" do
        assert composer.save!
        assert_equal bookmark, composer.job_invocation.targeting.bookmark
        assert_equal composer.job_invocation.targeting.user, User.current
        refute_empty composer.job_invocation.template_invocations
      end
    end

    context "with targeting from search query" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :targeting_type => "static_query",
          :search_query => "some hosts" }
      end

      it "creates invocation with a search query" do
        assert composer.save!
        assert_equal "some hosts", composer.job_invocation.targeting.search_query
        refute_empty composer.job_invocation.template_invocations
      end
    end

    context "with with inputs" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :targeting_type => "static_query",
          :search_query => "some hosts",
          :inputs => {input1.name => "some_value"}}
      end

      it "finds the inputs by name" do
        assert composer.save!
        assert_equal 1, composer.template_invocations.first.input_values.count
      end
    end

    context "with effective user" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :effective_user => 'invocation user',
          :targeting_type => "static_query",
          :search_query => "some hosts",
          :inputs => {input1.name => "some_value"}}
      end

      let(:template_invocation) { composer.job_invocation.template_invocations.first }

      it "sets the effective user based on the input" do
        assert composer.save!
        template_invocation.effective_user.must_equal 'invocation user'
      end
    end

    context "with invalid targeting" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :search_query => "some hosts",
          :inputs => {input1.name => "some_value"}}
      end

      it "handles errors" do
        assert_raises(ActiveRecord::RecordNotSaved) do
          composer.save!
        end
      end
    end

    context "with invalid bookmark and search query" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :targeting_type => "static_query",
          :search_query => "some hosts",
          :bookmark_id => bookmark.id,
          :inputs => {input1.name => "some_value"}}
      end

      it "handles errors" do
        assert_raises(Foreman::Exception) do
          JobInvocationComposer.from_api_params(params)
        end
      end
    end

    context "with invalid inputs" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :targeting_type => "static_query",
          :search_query => "some hosts",
          :inputs => {input3.name => nil}}
      end

      it "handles errors" do
        error = assert_raises(ActiveRecord::RecordNotSaved) do
          composer.save!
        end
        error.message.must_include "Template #{testing_job_template_1.name}: Input #{input3.name.downcase}: Value can't be blank"
      end
    end

    context "with empty values for non-required inputs" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :targeting_type => "static_query",
          :search_query => "some hosts",
          :inputs => {input3.name => "some value"}}
      end

      it "accepts the params" do
        composer.save!
        refute composer.job_invocation.new_record?
      end
    end

    context "with missing required inputs" do
      let(:params) do
        { :job_name => testing_job_template_1.job_name,
          :job_template_id => testing_job_template_1.id,
          :targeting_type => "static_query",
          :search_query => "some hosts",
          :inputs => {input1.name => "some_value"}}
      end

      it "handles errors" do
        input3.must_be :required

        error = assert_raises(ActiveRecord::RecordNotSaved) do
          composer.save!
        end

        error.message.must_include "Template #{testing_job_template_1.name}: Not all required inputs have values. Missing inputs: #{input3.name}"
      end
    end
  end
end
