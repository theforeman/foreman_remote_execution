require 'test_plugin_helper'
RemoteExecutionProvider.register(:ansible, OpenStruct)
RemoteExecutionProvider.register(:mcollective, OpenStruct)

describe JobInvocationComposer do
  before do
    permission = FactoryGirl.create(:permission, :name => 'view_job_templates', :resource_type => 'JobTemplate')
    filter = FactoryGirl.build(:filter, :permissions => [permission], :search => 'name ~ testing*')
    filter.save
    role = FactoryGirl.build(:role)
    role.filters<< filter
    role.save
    User.current = FactoryGirl.build(:user)
    User.current.roles<< role
    User.current.save
  end

  let(:testing_job_template_1) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing1', :provider_type => 'ssh') }
  let(:testing_job_template_2) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_2', :name => 'testing2', :provider_type => 'mcollective') }
  let(:testing_job_template_3) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing3', :provider_type => 'ssh') }
  let(:unauthorized_job_template_1) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'unauth1', :provider_type => 'ssh') }
  let(:unauthorized_job_template_2) { FactoryGirl.create(:job_template, :job_name => 'unauthorized_job_template_2', :name => 'unauth2', :provider_type => 'ansible') }

  let(:input1) { FactoryGirl.create(:template_input, :template => testing_job_template_1, :input_type => 'user') }
  let(:input2) { FactoryGirl.create(:template_input, :template => testing_job_template_3, :input_type => 'user') }
  let(:unauthorized_input1) { FactoryGirl.create(:template_input, :template => unauthorized_job_template_1, :input_type => 'user') }

  let(:ansible_params) { { } }
  let(:ssh_params) { { } }
  let(:mcollective_params) { { } }
  let(:providers_params) { { :providers => { :ansible => ansible_params, :ssh => ssh_params, :mcollective => mcollective_params } } }

  context 'with general new invocation and empty params' do
    let(:params) { {} }
    let(:composer) { JobInvocationComposer.new(JobInvocation.new, params) }

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
          provider_types.must_include 'ssh'
          provider_types.wont_include 'mcollective'
          provider_types.wont_include 'ansible'
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
          composer.available_template_inputs.must_be_empty
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
          composer.stubs(:available_provider_types => [ 'ssh', 'ansible' ])
          assert composer.needs_provider_type_selection?
        end

        it 'returns false if there is one provider' do
          composer.stubs(:available_provider_types => [ 'ssh' ])
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
          testing_job_template_4 = FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing4', :provider_type => 'ansible')
          result = composer.templates_for_provider('ssh')
          result.must_include testing_job_template_1
          result.must_include testing_job_template_3
          result.wont_include unauthorized_job_template_1
          result.wont_include testing_job_template_4

          result = composer.templates_for_provider('ansible')
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
          let(:unauthorized) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'unauth3', :provider_type => 'ansible') }
          let(:mcollective_authorized) { FactoryGirl.create(:job_template, :job_name => 'testing_job_template_1', :name => 'testing4', :provider_type => 'mcollective') }
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
            assert composer.preselect_disabled_for_provider('ssh')
          end
        end

        context 'available template was selected for a specified provider through params' do
          let(:ssh_params) { { :job_template_id => testing_job_template_1.id.to_s } }
          let(:params) { { :job_invocation => providers_params }.with_indifferent_access }

          it 'returns false because available template was selected' do
            refute composer.preselect_disabled_for_provider('ssh')
          end
        end
      end

      describe '#template_invocations' do
        let(:ssh_params) { { :job_template_id => testing_job_template_1.id.to_s, :job_templates => { testing_job_template_1.id.to_s => {
          :input_values => { input1.id.to_s => { :value => 'value1' },  unauthorized_input1.id.to_s => { :value => 'dropped' } }
        } } } }
        let(:params) { { :job_invocation => { :providers => { :ssh => ssh_params } } }.with_indifferent_access }
        let(:invocations) { composer.template_invocations }

        it 'builds template invocations based on passed params and it filters out wrong inputs' do
          invocations.size.must_equal 1
          invocations.first.input_values.size.must_equal 1
          invocations.first.input_values.first.value.must_equal 'value1'
        end
      end

      describe '#displayed_search_query' do
      end

      describe '#available_bookmarks' do
      end
      describe '#targeted_hosts_count' do
      end
      describe '#template_invocation_input_value_for(input)' do
      end
      describe '#valid?' do
      end
      describe '#save' do
      end
      describe '#job_name' do
      end
      describe '#targeting' do
      end

    end
  end
end
