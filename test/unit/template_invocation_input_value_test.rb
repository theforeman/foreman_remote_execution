require 'test_plugin_helper'

class TemplateInvocationInputTest < ActiveSupport::TestCase
  let(:template) { FactoryBot.build(:job_template, :template => 'service restart <%= input("service_name") -%>') }
  let(:renderer) { InputTemplateRenderer.new(template) }
  let(:job_invocation) { FactoryBot.create(:job_invocation) }
  let(:template_invocation) { FactoryBot.build(:template_invocation, :template => template) }
  let(:result) { renderer.render }

  context 'with selectable options' do
    before do
      result # let is lazy
      template.template_inputs << FactoryBot.build(:template_input, :name => 'service_name', :input_type => 'user',
                                                                    :required => true, :options => "foreman\nhttpd")
    end

    it 'fails with an invalid option' do
      refute_valid FactoryBot.build(:template_invocation_input_value, :template_invocation => template_invocation,
                                                                      :template_input => template.template_inputs.first,
                                                                      :value => 'sendmail')
    end

    it 'succeeds with valid option' do
      assert_valid FactoryBot.build(:template_invocation_input_value, :template_invocation => template_invocation,
                                                                      :template_input => template.template_inputs.first,
                                                                      :value => 'foreman')
    end
  end

  it 'supports large inputs' do
    template.template_inputs << FactoryBot.build(:template_input, :name => 'service_name',
                                                                  :input_type => 'user', :required => true)
    assert_valid FactoryBot.create(:template_invocation_input_value,
      :template_invocation => template_invocation,
      :template_input => template.template_inputs.first,
      :value => 'foreman' * 1_000_000)
  end
end
