require 'test_plugin_helper'

describe JobTemplate do
  context 'when creating a template' do
    let(:job_template) { FactoryGirl.build(:job_template, :job_name => '') }

    it 'needs a job_name' do
      refute job_template.valid?
    end

    it 'does not need a job_name if it is a snippet' do
      job_template.snippet = true
      assert job_template.valid?
    end
  end

  context 'cloning' do
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

  context 'importing a template' do
    let(:template) do
      template = <<-END_TEMPLATE
      <%#
      kind: job_template
      name: Service Restart
      job_name: Service Restart
      provider_type: Ssh
      template_inputs:
      - name: service_name
        input_type: user
        required: true
      %>

      service <%= input("service_name") %> restart
      END_TEMPLATE

      JobTemplate.import(template, :default => true)
    end

    it 'sets the name' do
      template.name.must_equal 'Service Restart'
    end

    it 'has a template' do
      template.template.squish.must_equal 'service <%= input("service_name") %> restart'
    end

    it 'imports inputs' do
      template.template_inputs.first.name.must_equal 'service_name'
    end

    it 'sets additional options' do
      template.default.must_equal true
    end
  end

  context 'there is existing template invocation of a job template' do
    let(:job_invocation) { FactoryGirl.create(:job_invocation, :with_template) }
    let(:job_template) { job_invocation.template_invocations.first.template }

    describe 'job template deletion' do
      it 'succeeds' do
        job_template.template_invocations.wont_be_empty
        assert job_template.destroy
      end
    end
  end
end
