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
      input = job_invocation.template_invocations.first.template.template_inputs.create!(:name => 'foo', :required => true, :input_type => 'user')
      @input_value = FactoryGirl.create(:template_invocation_input_value,
                                        :template_invocation =>  job_invocation.template_invocations.first,
                                        :template_input      => input)
      job_invocation.reload
      job_invocation.template_invocations.first.reload
    end

    it { refute job_invocation.reload.template_invocations.empty? }
    it { refute job_invocation.reload.template_invocations.first.input_values.empty? }

    it 'validates required inputs have values' do
      assert job_invocation.valid?
      @input_value.destroy
      refute job_invocation.reload.valid?
    end

    describe 'descriptions' do
      it 'generates description from input values' do
        job_invocation.expects(:save!)
        job_invocation.description_format = '%{job_name} - %{foo}'
        job_invocation.generate_description!
        job_invocation.description.must_equal "#{job_invocation.job_name} - #{@input_value.value}"
      end

      it 'handles missing keys correctly' do
        job_invocation.expects(:save!)
        job_invocation.description_format = '%{job_name} - %{missing_key}'
        job_invocation.generate_description!
        job_invocation.description.must_equal "#{job_invocation.job_name} - %{missing_key}"
      end
    end
  end

  context 'future execution' do

    it 'can report host count' do
      job_invocation.total_hosts_count.must_equal 'N/A'
      job_invocation.targeting.expects(:resolved_at).returns(Time.now)
      job_invocation.total_hosts_count.must_equal 0
    end

  end
end
