require 'test_plugin_helper'

describe JobInvocation do

  let(:job_invocation) { FactoryGirl.build(:job_invocation) }
  let(:template) { FactoryGirl.create(:job_template, :with_input) }

  context 'Search for job invocations' do
    before do
      job_invocation.save
    end

    it 'is able to perform search through job invocations' do
      found_jobs = JobInvocation.search_for(%{job_name = "#{job_invocation.job_name}"}).paginate(:page => 1).with_task.order('job_invocations.id DESC')
      found_jobs.must_equal [job_invocation]
    end
  end

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

      it 'truncates generated description to 255 characters' do
        column_limit = 255
        expected_result = 'a' * column_limit
        JobInvocation.columns_hash['description'].expects(:limit).returns(column_limit)
        job_invocation.expects(:save!)
        job_invocation.description_format = '%{job_name}'
        job_invocation.job_name = 'a' * 1000
        job_invocation.generate_description!
        job_invocation.description.must_equal expected_result
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
