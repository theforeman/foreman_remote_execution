require 'test_plugin_helper'

describe JobTemplate do
  context 'when creating a template' do
    let(:job_template) { FactoryGirl.build(:job_template, :job_category => '') }
    let(:template_with_inputs) do
      FactoryGirl.build(:job_template, :template => 'test').tap do |template|
        template.template_inputs << FactoryGirl.build(:template_input, :name => 'command', :input_type => 'user')
        template.save!
      end
    end

    it 'needs a job_category' do
      refute job_template.valid?
    end

    it 'does not need a job_category if it is a snippet' do
      job_template.snippet = true
      assert job_template.valid?
    end

    it 'validates the inputs are uniq in the template' do
      job_template.job_category = 'Miscellaneous'
      job_template.foreign_input_sets << FactoryGirl.build(:foreign_input_set, :target_template => template_with_inputs)
      job_template.foreign_input_sets << FactoryGirl.build(:foreign_input_set, :target_template => template_with_inputs)
      refute job_template.valid?
      job_template.errors.full_messages.first.must_include 'Duplicated inputs detected: ["command"]'
    end
  end

  context 'description format' do
    let(:template_with_description) { FactoryGirl.build(:job_template, :with_description_format, :job_category => 'test job') }
    let(:template) { FactoryGirl.build(:job_template, :with_input, :job_category => 'test job') }
    let(:minimal_template) { FactoryGirl.build(:job_template) }

    it 'uses the description_format attribute if set' do
      template_with_description.generate_description_format.must_equal template_with_description.description_format
    end

    it 'uses the job name as description_format if not set or blank and has no inputs' do
      minimal_template.generate_description_format.must_equal '%{job_category}'
      minimal_template.description_format = ''
      minimal_template.generate_description_format.must_equal '%{job_category}'
    end

    it 'generates the description_format if not set or blank and has inputs' do
      input_name = template.template_inputs.first.name
      expected_result = %Q(%{job_category} with inputs #{input_name}="%{#{input_name}}")
      template.generate_description_format.must_equal expected_result
      template.description_format = ''
      template.generate_description_format.must_equal expected_result
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
      job_category: Service Restart
      provider_type: SSH
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
    let(:job_template) { job_invocation.pattern_template_invocations.first.template }

    describe 'job template deletion' do
      it 'succeeds' do
        job_template.pattern_template_invocations.wont_be_empty
        assert job_template.destroy
      end
    end
  end

  context 'template locked' do
    it 'inputs cannot be changed' do
      job_template = FactoryGirl.create(:job_template, :with_input, :locked => true)
      Foreman.expects(:in_rake?).returns(false).at_least_once
      assert_valid job_template
      job_template.template_inputs.first.name = 'something else'
      refute_valid job_template
    end
  end
end
