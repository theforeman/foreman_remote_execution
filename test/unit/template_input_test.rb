require 'test_plugin_helper'

describe TemplateInput do
  let(:template_input) { FactoryGirl.build(:template_input) }

  context 'user input' do
    before { template_input.input_type = 'user' }
    it { assert template_input.user_template_input? }
  end

  context 'fact input' do
    before { template_input.input_type = 'fact' }
    it { assert template_input.fact_template_input? }
  end

  context 'variable input' do
    before { template_input.input_type = 'variable' }
    it { assert template_input.variable_template_input? }
  end

  context 'puppet parameter input' do
    before { template_input.input_type = 'puppet_parameter' }
    it { assert template_input.puppet_parameter_template_input? }
  end
end
