require 'test_plugin_helper'

describe JobTemplate do
  let(:job_template) { FactoryGirl.build(:job_template, :with_input) }

  describe '#dup' do
    it 'duplicates also template inputs' do
      duplicate = job_template.dup
      duplicate.wont_equal job_template
      duplicate.template_inputs.wont_be_empty
      duplicate.template_inputs.first.wont_equal job_template.template_inputs.first
      duplicate.template_inputs.first.name.must_equal job_template.template_inputs.first.name
    end
  end
end
