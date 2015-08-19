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

  context 'future execution' do

    it 'can report host count' do
      job_invocation.total_hosts_count.must_equal 'N/A'
      job_invocation.targeting.expects(:resolved_at).returns(Time.now)
      job_invocation.total_hosts_count.must_equal 0
    end

    it 'has default trigger mode' do
      job_invocation.trigger_mode.must_equal :immediate
    end

    it 'cannot set trigger mode to anything other than :immediate or :future' do
      proc { job_invocation.trigger_mode = 'test' }.must_raise ::Foreman::Exception
      job_invocation.trigger_mode.must_equal :immediate
    end

    it 'cannot change trigger mode once set' do
      job_invocation.trigger_mode = 'future'
      job_invocation.trigger_mode = 'immediate'
      job_invocation.trigger_mode.must_equal :future
    end

    it 'parses times' do
      time = Time.new(2015, 9, 16, 13, 56)
      time_string = time.strftime(job_invocation.time_format)
      job_invocation.start_at_parsed.must_equal false
      job_invocation.start_at = time_string
      job_invocation.start_at_parsed.must_equal time
      job_invocation.start_before.must_be_nil
      job_invocation.start_before_parsed.must_be_nil
      job_invocation.start_before = time_string
      job_invocation.start_before_parsed.must_equal time
    end

  end
end
