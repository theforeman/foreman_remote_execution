require 'test_plugin_helper'

describe InputTemplateRenderer do
  context "renderer for simple template without inputs" do
    let(:renderer) { InputTemplateRenderer.new(FactoryGirl.build(:job_template, :template => 'id')) }

    it 'should render the content' do
      renderer.render.must_equal 'id'
    end

    it 'should render preview' do
      renderer.preview.must_equal 'id'
    end
  end

  context "renderer for template with user input used" do
    let(:template) { FactoryGirl.build(:job_template, :template => 'service restart <%= input("service_name") -%>') }
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

      let(:job_invocation) { FactoryGirl.create(:job_invocation) }
      let(:template_invocation) { FactoryGirl.build(:template_invocation, :template => template) }
      let(:result) { renderer.render }

      before do
        template.template_inputs << FactoryGirl.build(:template_input, :name => 'service_name', :input_type => 'user')
        job_invocation.template_invocations << template_invocation
        renderer.invocation = template_invocation
      end

      describe 'rendering' do
        it 'can\'t render the content without job invocation since we don\'t have values' do
          refute result
        end

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end

        context 'with invocation specified' do
          before do
            FactoryGirl.create(:template_invocation_input_value,
                               :template_invocation => template_invocation,
                               :template_input => template.template_inputs.first,
                               :value => 'foreman')
          end

          it 'can render with job invocation with corresponding value' do
            renderer.render.must_equal 'service restart foreman'
          end
        end
      end

      describe 'preview' do
        it 'should render preview' do
          renderer.preview.must_equal 'service restart $USER_INPUT[service_name]'
        end
      end
    end
  end

  context "renderer for template with fact input used" do
    let(:template) { FactoryGirl.build(:job_template, :template => 'echo <%= input("issue") -%> > /etc/issue') }
    let(:renderer) { InputTemplateRenderer.new(template) }

    context 'with matching input defined' do
      before { renderer.template.template_inputs<< FactoryGirl.build(:template_input, :name => 'issue', :input_type => 'fact', :fact_name => 'issue') }
      let(:result) { renderer.render }

      describe 'rendering' do
        it 'can\'t render the content without host since we don\'t have facts' do
          refute result
        end

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end

        context 'with host specified' do
          before { renderer.host = FactoryGirl.create(:host) }

          describe 'rendering' do
            it 'can\'t render the content without host since we don\'t have fact value' do
              refute result
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
            let(:fact) { FactoryGirl.create(:fact_name, :name => 'issue') }

            describe 'rendering' do
              it 'can\'t render the content without host since we don\'t have fact value' do
                fact # let is lazy
                refute result
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
              before { FactoryGirl.create(:fact_value, :host => renderer.host, :fact_name => fact, :value => 'banner') }

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
            host = FactoryGirl.create(:host)
            fact = FactoryGirl.create(:fact_name, :name => 'issue')
            FactoryGirl.create(:fact_value, :host => host, :fact_name => fact, :value => 'banner')
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

  context "renderer for template with variable input used" do
    let(:template) { FactoryGirl.build(:job_template, :template => 'echo <%= input("client_key") -%> > /etc/chef/client.pem') }
    let(:renderer) { InputTemplateRenderer.new(template) }

    context 'with matching input defined' do
      before { renderer.template.template_inputs<< FactoryGirl.build(:template_input, :name => 'client_key', :input_type => 'variable', :variable_name => 'client_key') }
      let(:result) { renderer.render }

      describe 'rendering' do
        it 'can\'t render the content without host since we don\'t have host so no classification' do
          refute result
        end

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end

        context 'with host specified' do
          let(:environment) { FactoryGirl.create(:environment) }
          before { renderer.host = FactoryGirl.create(:host, :environment => environment) }

          describe 'rendering' do
            it 'can\'t render the content without host since we don\'t have variable value in classification' do
              refute result
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
            let(:parameter) { FactoryGirl.create(:host_parameter, :host => renderer.host, :name => 'client_key', :value => 'RSA KEY') }

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

          context 'with existing variable implemented as smart variable' do
            let(:puppet_class) { FactoryGirl.create(:puppetclass, :environments => [environment], :hosts => [renderer.host]) }
            let(:lookup_key) do
              FactoryGirl.create(:lookup_key,
                                 :key => 'client_key',
                                 :puppetclass => puppet_class,
                                 :overrides => {"fqdn=#{renderer.host.fqdn}" => "RSA KEY"})
            end

            describe 'rendering' do
              it 'renders the value from host parameter' do
                lookup_key
                result.must_equal 'echo RSA KEY > /etc/chef/client.pem'
              end
            end

            describe 'preview' do
              it 'should render preview' do
                lookup_key
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

  context "renderer for template with puppet parameter input used" do
    let(:template) { FactoryGirl.build(:job_template, :template => 'echo "This is WebServer with nginx <%= input("nginx_version") -%>" > /etc/motd') }
    let(:renderer) { InputTemplateRenderer.new(template) }

    context 'with matching input defined' do
      before do
        renderer.template.template_inputs<< FactoryGirl.build(:template_input,
                                                              :name => 'nginx_version',
                                                              :input_type => 'puppet_parameter',
                                                              :puppet_parameter_name => 'version',
                                                              :puppet_class_name => 'nginx')
      end
      let(:result) { renderer.render }

      describe 'rendering' do
        it 'can\'t render the content without host since we don\'t have host so no classification' do
          refute result
        end

        it 'registers an error' do
          result # let is lazy
          renderer.error_message.wont_be_nil
          renderer.error_message.wont_be_empty
        end

        context 'with host specified' do
          let(:environment) { FactoryGirl.create(:environment) }
          before { renderer.host = FactoryGirl.create(:host, :environment => environment) }

          describe 'rendering' do
            it 'can\'t render the content without host since we don\'t have puppet parameter in classification' do
              refute result
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
              FactoryGirl.create(:puppetclass, :environments => [environment], :hosts => [renderer.host], :name => 'nginx')
            end
            let(:lookup_key) do
              FactoryGirl.create(:lookup_key, :as_smart_class_param, :with_override,
                                 :key => 'version',
                                 :puppetclass => puppet_class,
                                 :path => 'fqdn',
                                 :overrides => {"fqdn=#{renderer.host.fqdn}" => "1.4.7"})
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
