require 'test_plugin_helper'

class InputTemplateRendererTest < ActiveSupport::TestCase
  let(:host) { FactoryBot.build(:host) }

  context 'renderer for simple template without inputs' do
    let(:renderer) { InputTemplateRenderer.new(FactoryBot.build(:job_template, :template => 'id <%= preview? %>')) }

    it 'should render the content' do
      renderer.render.must_equal 'id false'
    end

    it 'should render preview' do
      renderer.preview.must_equal 'id true'
    end

    it 'should allow accessing current_user' do
      setup_user(:view_job_templates)
      renderer = InputTemplateRenderer.new(FactoryBot.build(:job_template, :template => "They call me '<%= current_user %>'"))
      renderer.preview.must_equal "They call me '#{User.current.login}'"
    end
  end

  context 'renderer for template with user input used' do
    let(:template) { FactoryBot.build(:job_template, :template => 'service restart <%= input("service_name") -%>') }
    let(:renderer) { InputTemplateRenderer.new(template) }

    context 'but without input defined' do
      describe 'rendering' do
        let(:result) { renderer.render }
        it { result.must_equal false }

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end
      end

      describe 'preview' do
        let(:result) { renderer.preview }
        it { result.must_equal false }

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end
      end
    end

    context 'with matching input defined' do

      let(:job_invocation) { FactoryBot.create(:job_invocation) }
      let(:template_invocation) { FactoryBot.build(:template_invocation, :template => template) }
      let(:result) { renderer.render }

      before do
        template.template_inputs << FactoryBot.build(:template_input, :name => 'service_name', :input_type => 'user')
        job_invocation.template_invocations << template_invocation
      end

      describe 'rendering' do
        it 'can preview' do
          renderer.preview.must_equal 'service restart $USER_INPUT[service_name]'
        end

        context 'with invocation specified and a required input' do
          before do
            template.template_inputs.first.update_attributes(:required => true)
            template_invocation.reload
            renderer.invocation = template_invocation
          end

          it 'cannot render the content' do
            assert_not result
            renderer.error_message.wont_be_nil
            renderer.error_message.wont_be_empty
          end
        end

        context 'with invocation specified' do
          before do
            FactoryBot.create(:template_invocation_input_value,
                              :template_invocation => template_invocation,
                              :template_input => template.template_inputs.first,
                              :value => 'foreman')
            template_invocation.reload # need to get input_values findable
            renderer.invocation = template_invocation
          end

          it 'can render with job invocation with corresponding value' do
            renderer.render.must_equal 'service restart foreman'
          end
        end

        it 'renders even without an input value' do
          renderer.invocation = template_invocation
          renderer.render.must_equal 'service restart '
        end

        describe 'with circular reference' do
          let(:recursive_template_with_inputs) do
            FactoryBot.create(:job_template, :name => 'test', :template => 'test')
          end

          let(:template_with_inputs) do
            FactoryBot.create(:job_template, :template => 'test').tap do |template|
              template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => recursive_template_with_inputs)
            end
          end

          let(:recursive_template_without_inputs) do
            FactoryBot.create(:job_template, :name => 'recursive template', :template => '<%= render_template("template with inputs", "action" => "install") %>')
          end

          let(:template_without_inputs) do
            FactoryBot.create(:job_template, :name => 'template with inputs', :template => "<%= render_template('#{recursive_template_without_inputs.name}') %>")
          end

          before do
            User.current = users :admin
          end

          it 'handles circular references in templates' do
            renderer.invocation = FactoryBot.build(:template_invocation, :template => template_without_inputs)
            renderer.template = template_without_inputs
            assert_not renderer.render
            renderer.error_message.must_include 'Recursive rendering of templates detected'
          end

          it 'handles circular references in inputs' do
            assert_raises(ActiveRecord::RecordInvalid) do
              input_set = FactoryBot.build(:foreign_input_set, :target_template => template_with_inputs, :include_all => false,
                                                               :include => 'package, debug', :exclude => 'action,debug')
              recursive_template_with_inputs.foreign_input_sets << input_set
              recursive_template_with_inputs.save!
            end
          end
        end
      end
    end

    context 'renderer for template with input set and render_template' do
      let(:command_template) do
        FactoryBot.build(:job_template, :name => 'command action', :template => '<%= input("command") -%>').tap do |template|
          template.template_inputs << FactoryBot.build(:template_input, :name => 'command', :input_type => 'user')
          template.template_inputs << FactoryBot.build(:template_input, :name => 'debug', :input_type => 'user')
        end
      end

      let(:package_template) do
        FactoryBot.build(:job_template, :name => 'package action', :template => <<-TEMPLATE.strip_heredoc) do |template|
          <%= render_template("command action", "command" => "yum -y \#{ input("action") } \#{ input('package') }") -%>
        TEMPLATE
          template.template_inputs << FactoryBot.build(:template_input, :name => 'package', :input_type => 'user')
          template.template_inputs << FactoryBot.build(:template_input, :name => 'action', :input_type => 'user')
          template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => command_template, :include_all => true, :exclude => 'command')
        end
      end

      let(:template) do
        FactoryBot.create(:job_template,
                          :template => '<%= render_template("package action", { :action => "install" }, { :with_foreign_input_set => true }) %>').tap do |template|
          template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => package_template, :include_all => true, :exclude => 'action')
        end
      end

      let(:job_invocation) { FactoryBot.create(:job_invocation) }
      let(:template_invocation) { FactoryBot.build(:template_invocation, :template => template) }
      let(:renderer) { InputTemplateRenderer.new(template) }
      let(:result) { renderer.render }

      before do
        User.current = users :admin
        command_template.save!
        package_template.save!
        job_invocation.template_invocations << template_invocation
      end

      describe 'foreign input set' do
        describe 'with include_all' do
          let(:template) do
            FactoryBot.create(:job_template, :template => '<%= render_template("package action", "action" => "install") %>').tap do |template|
              template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => package_template, :include_all => true)
            end
          end

          let(:template_2) do
            FactoryBot.create(:job_template, :template => '<%= render_template("package action", "action" => "install") %>').tap do |template|
              template.foreign_input_sets << FactoryBot.build(:foreign_input_set,
                                                              :target_template => package_template, :include_all => true, :include => '', :exclude => '')
            end
          end

          it 'includes all inputs from the imported template' do
            template.template_inputs_with_foreign.map(&:name).sort.must_equal ['action', 'debug', 'package']
            template_2.template_inputs_with_foreign.map(&:name).sort.must_equal ['action', 'debug', 'package']
          end
        end

        describe 'with include_all and some excludes' do
          let(:template) do
            FactoryBot.create(:job_template, :template => '<%= render_template("package action", "action" => "install") %>').tap do |template|
              template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => package_template, :include_all => true, :exclude => 'action,debug')
            end
          end

          it 'includes all inputs from the imported template except the listed once' do
            template.template_inputs_with_foreign.map(&:name).sort.must_equal ['package']
          end
        end

        describe 'with some includes and some excludes' do
          let(:template) do
            FactoryBot.create(:job_template, :template => '<%= render_template("package action", "action" => "install") %>').tap do |template|
              template.foreign_input_sets << FactoryBot.build(:foreign_input_set, :target_template => package_template, :include_all => false,
                                                                                  :include => 'package, debug', :exclude => 'action,debug')
            end
          end

          it 'includes all inputs from the imported template' do
            template.template_inputs_with_foreign.map(&:name).sort.must_equal ['package']
          end
        end
      end

      context 'with invocation specified' do
        before do
          FactoryBot.create(:template_invocation_input_value,
                            :template_invocation => template_invocation,
                            :template_input => template.template_inputs_with_foreign.find { |input| input.name == 'package' },
                            :value => 'zsh')
          renderer.invocation = template_invocation
          renderer.invocation.reload
        end

        it 'can render with job invocation with corresponding value' do
          rendered = renderer.render
          renderer.error_message.must_be_nil
          rendered.must_equal 'yum -y install zsh'
        end
      end

      context 'with explicitly specifying inputs' do
        let(:template) do
          FactoryBot.create(:job_template,
                            :template => '<%= render_template("package action", {"action" => "install", :package => "zsh"}) %>')
        end

        before do
          template_invocation.reload
          renderer.invocation = template_invocation
        end

        it 'can render with job invocation with corresponding value' do
          rendered = renderer.render
          renderer.error_message.must_be_nil
          rendered.must_equal 'yum -y install zsh'
        end
      end

      it 'renders even without an input value' do
        renderer.invocation = template_invocation
        rendered = renderer.render
        renderer.error_message.must_be_nil
        rendered.must_equal 'yum -y install '
      end
    end

    context 'with options specified' do
      let(:job_invocation) { FactoryBot.create(:job_invocation) }
      let(:template_invocation) { FactoryBot.build(:template_invocation, :template => template) }
      let(:result) { renderer.render }
      let(:required) { false }
      let(:input) do
        FactoryBot.create(:template_invocation_input_value,
                          :template_invocation => template_invocation,
                          :template_input => template.template_inputs.first,
                          :value => 'foreman')
      end

      before do
        template.template_inputs << FactoryBot.build(:template_input, :name => 'service_name', :input_type => 'user', :options => "httpd\nforeman", :required => required)
        job_invocation.template_invocations << template_invocation
        input
        template_invocation.reload
        renderer.invocation = template_invocation
      end

      context 'with a valid input defined' do
        context 'with an optional input' do
          it 'can render with job invocation with corresponding value' do
            result.must_equal 'service restart foreman'
          end
        end

        context 'with required input' do
          let(:required) { true }

          it 'renders the template when the input is provided' do
            result.must_equal 'service restart foreman'
          end
        end
      end

      context 'without provided input' do
        let(:input) { nil }

        context 'with optional input' do
          it 'renders the template' do
            result.must_equal 'service restart '
          end
        end

        context 'with required input' do
          let(:required) { true }

          it 'renders the template' do
            result
            assert_match(/Value for required input '.*' was not specified/, renderer.error_message)
          end
        end
      end
    end
  end

  context 'renderer for template with fact input used' do
    let(:template) { FactoryBot.build(:job_template, :template => 'echo <%= input("issue") -%> > /etc/issue') }
    let(:renderer) { InputTemplateRenderer.new(template) }

    context 'with matching input defined' do
      before { renderer.template.template_inputs<< FactoryBot.build(:template_input, :name => 'issue', :input_type => 'fact', :fact_name => 'issue', :required => true) }
      let(:result) { renderer.render }

      describe 'rendering' do
        it 'can\'t render the content without host since we don\'t have facts' do
          assert_not result
        end

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end

        context 'with host specified' do
          before { renderer.host = FactoryBot.create(:host) }

          describe 'rendering' do
            it 'can\'t render the content without host since we don\'t have fact value' do
              assert_not result
            end

            it 'registers an error' do
              result # let is lazy
              renderer.error_message.wont_be_nil
              renderer.error_message.wont_be_empty
            end
          end

          describe 'preview' do
            it 'should render preview' do
              renderer.preview.must_equal 'echo $FACT_INPUT[issue] > /etc/issue'
            end
          end

          context 'with existing fact' do
            let(:fact) { FactoryBot.create(:fact_name, :name => 'issue') }

            describe 'rendering' do
              it 'can\'t render the content without host since we don\'t have fact value' do
                fact # let is lazy
                assert_not result
              end

              it 'registers an error' do
                result # let is lazy
                renderer.error_message.wont_be_nil
                renderer.error_message.wont_be_empty
              end
            end

            describe 'preview' do
              it 'should render preview' do
                renderer.preview.must_equal 'echo $FACT_INPUT[issue] > /etc/issue'
              end
            end

            context 'with fact issue value' do
              before { FactoryBot.create(:fact_value, :host => renderer.host, :fact_name => fact, :value => 'banner') }

              let(:result) { renderer.render }

              it 'can render with job invocation with corresponding value' do
                result.must_equal 'echo banner > /etc/issue'
              end
            end
          end
        end
      end

      describe 'preview' do
        it 'should render preview' do
          renderer.preview.must_equal 'echo $FACT_INPUT[issue] > /etc/issue'
        end

        context 'with host specified' do
          before do
            host = FactoryBot.create(:host)
            fact = FactoryBot.create(:fact_name, :name => 'issue')
            FactoryBot.create(:fact_value, :host => host, :fact_name => fact, :value => 'banner')
            renderer.host = host
          end

          let(:result) { renderer.render }

          it 'uses the value even in preview' do
            result.must_equal 'echo banner > /etc/issue'
          end
        end
      end
    end
  end

  context 'renderer for template with variable input used' do
    let(:template) { FactoryBot.build(:job_template, :template => 'echo <%= input("client_key") -%> > /etc/chef/client.pem') }
    let(:renderer) { InputTemplateRenderer.new(template) }

    context 'with matching input defined' do
      before { renderer.template.template_inputs<< FactoryBot.build(:template_input, :name => 'client_key', :input_type => 'variable', :variable_name => 'client_key') }
      let(:result) { renderer.render }

      describe 'rendering' do
        it 'can\'t render the content without host since we don\'t have host so no classification' do
          assert_not result
        end

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end

        context 'with host specified' do
          before { User.current = FactoryBot.build(:user, :admin) }
          after { User.current = nil }

          let(:environment) { FactoryBot.create(:environment) }
          before { renderer.host = FactoryBot.create(:host, :environment => environment) }

          describe 'rendering' do
            it 'can\'t render the content without host since we don\'t have variable value in classification' do
              assert_not result
            end

            it 'registers an error' do
              result # let is lazy
              renderer.error_message.wont_be_nil
              renderer.error_message.wont_be_empty
            end
          end

          describe 'preview' do
            it 'should render preview' do
              renderer.preview.must_equal 'echo $VARIABLE_INPUT[client_key] > /etc/chef/client.pem'
            end
          end


          context 'with existing variable implemented as host parameter' do
            let(:parameter) { FactoryBot.create(:host_parameter, :host => renderer.host, :name => 'client_key', :value => 'RSA KEY') }

            describe 'rendering' do
              it 'renders the value from host parameter' do
                parameter
                renderer.host.reload
                result.must_equal 'echo RSA KEY > /etc/chef/client.pem'
              end
            end

            describe 'preview' do
              it 'should render preview' do
                parameter
                renderer.host.reload
                renderer.preview.must_equal 'echo RSA KEY > /etc/chef/client.pem'
              end
            end
          end
        end

        describe 'preview' do
          it 'should render preview' do
            renderer.preview.must_equal 'echo $VARIABLE_INPUT[client_key] > /etc/chef/client.pem'
          end
        end
      end
    end
  end

  context 'renderer for template with puppet parameter input used' do
    let(:template) { FactoryBot.build(:job_template, :template => 'echo "This is WebServer with nginx <%= input("nginx_version") -%>" > /etc/motd') }
    let(:renderer) { InputTemplateRenderer.new(template) }

    context 'with matching input defined' do
      before do
        renderer.template.template_inputs<< FactoryBot.build(:template_input,
                                                             :name => 'nginx_version',
                                                             :input_type => 'puppet_parameter',
                                                             :puppet_parameter_name => 'version',
                                                             :puppet_class_name => 'nginx')
      end
      let(:result) { renderer.render }

      describe 'rendering' do
        it 'can\'t render the content without host since we don\'t have host so no classification' do
          assert_not result
        end

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end

        context 'with host specified' do
          let(:environment) { FactoryBot.create(:environment) }
          before { renderer.host = FactoryBot.create(:host, :environment => environment) }

          describe 'rendering' do
            it 'can\'t render the content without host since we don\'t have puppet parameter in classification' do
              assert_not result
            end

            it 'registers an error' do
              result # let is lazy
              renderer.error_message.wont_be_nil
              renderer.error_message.wont_be_empty
            end
          end

          describe 'preview' do
            it 'should render preview' do
              renderer.preview.must_equal 'echo "This is WebServer with nginx $PUPPET_PARAMETER_INPUT[nginx_version]" > /etc/motd'
            end
          end

          context 'with existing puppet parameter with matching override' do
            let(:puppet_class) do
              puppetclass = FactoryBot.create(:puppetclass, :environments => [environment], :name => 'nginx')
              puppetclass.update_attribute(:hosts, [renderer.host])
              puppetclass
            end
            let(:lookup_key) do
              FactoryBot.create(:puppetclass_lookup_key, :as_smart_class_param,
                                :key => 'version',
                                :puppetclass => puppet_class,
                                :path => 'fqdn',
                                :override => true,
                                :overrides => {"fqdn=#{renderer.host.fqdn}" => '1.4.7'})
            end

            describe 'rendering' do
              it 'renders the value from puppet parameter' do
                lookup_key
                result.must_equal 'echo "This is WebServer with nginx 1.4.7" > /etc/motd'
              end
            end

            describe 'preview' do
              it 'should render preview' do
                lookup_key
                renderer.preview.must_equal 'echo "This is WebServer with nginx 1.4.7" > /etc/motd'
              end
            end
          end
        end

        describe 'preview' do
          it 'should render preview' do
            renderer.preview.must_equal 'echo "This is WebServer with nginx $PUPPET_PARAMETER_INPUT[nginx_version]" > /etc/motd'
          end
        end
      end
    end
  end
end
