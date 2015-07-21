require 'test_plugin_helper'

describe JobInvocation do

  let(:job_invocation) { FactoryGirl.build(:job_invocation) }
  let(:template) { FactoryGirl.create(:job_template, :with_input) }

  context 'Able to be created' do
    it { assert job_invocation.save }
  end

  context 'Requires targeting' do
    before { job_invocation.targeting = nil }

    it { refute_valid job_invocation }
  end

  context 'has template invocations with input values' do
    let(:job_invocation) { FactoryGirl.create(:job_invocation, :with_template) }

    before do
      @input_value = FactoryGirl.create(:template_invocation_input_value,
                                        :template_invocation =>  job_invocation.template_invocations.first,
                                        :template_input      => template.template_inputs.first)

    end

    it { refute job_invocation.reload.template_invocations.empty? }
    it { refute job_invocation.template_invocations.first.input_values.empty? }
  end
end
