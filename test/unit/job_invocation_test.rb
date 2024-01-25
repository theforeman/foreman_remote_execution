require 'test_plugin_helper'

class JobInvocationTest < ActiveSupport::TestCase
  let(:job_invocation) { FactoryBot.build(:job_invocation, :description => 'A text with "quotes"') }
  let(:template) { FactoryBot.create(:job_template, :with_input) }

  context 'search for job invocations' do
    before do
      job_invocation.save
    end

    it 'is able to perform search through job invocations' do
      found_jobs = JobInvocation.search_for(%{job_category = "#{job_invocation.job_category}"}).paginate(:page => 1).order('job_invocations.id DESC')
      assert_equal [job_invocation], found_jobs
    end

    it 'is able to auto complete description' do
      expected = 'description =  "A text with \"quotes\""'
      assert_equal [expected], JobInvocation.complete_for('description = ')
    end
  end

  context 'able to be created' do
    it { assert job_invocation.save }
  end

  context 'requires targeting' do
    before { job_invocation.targeting = nil }

    it { refute_valid job_invocation }
  end

  context 'can delete a host' do
    let(:host) do
      FactoryBot.create(:host)
    end

    it 'can remove a host' do
      job_invocation.template_invocations.build(:host_id => host.id, :template_id => template.id)
      job_invocation.save!
      host.destroy
      job_invocation.reload
      assert_empty job_invocation.template_invocations
    end
  end

  context 'has template invocations with input values' do
    let(:job_invocation) { FactoryBot.create(:job_invocation, :with_template) }

    before do
      input = job_invocation.pattern_template_invocations.first.template.template_inputs.create!(:name => 'foo', :required => true, :input_type => 'user')
      input2 = job_invocation.pattern_template_invocations.first.template.template_inputs.create!(:name => 'bar', :required => true, :input_type => 'user')
      FactoryBot.create(:template_invocation_input_value,
        :template_invocation => job_invocation.pattern_template_invocations.first,
        :template_input => input2)
      @input_value = FactoryBot.create(:template_invocation_input_value,
        :template_invocation => job_invocation.pattern_template_invocations.first,
        :template_input => input)
      job_invocation.reload
      job_invocation.pattern_template_invocations.first.reload
    end

    it { assert_not job_invocation.reload.pattern_template_invocations.empty? }
    it { assert_not job_invocation.reload.pattern_template_invocations.first.input_values.empty? }

    it "can look up templates not belonging to user's organization" do
      organization = job_invocation.pattern_template_invocations.first.template.organizations.first
      Organization.current = organization
      job_invocation.pattern_template_invocations.first.template.organizations = []
      # The following line raises UndefinedMethod if the user can't look up the template
      job_invocation.pattern_template_invocations.first.template.name

      # Restore things to original state
      job_invocation.pattern_template_invocations.first.template.organizations = [organization]
      Organization.current = nil
    end

    it 'validates required inputs have values' do
      assert job_invocation.valid?
      @input_value.destroy
      assert_not job_invocation.reload.valid?
    end

    describe 'descriptions' do
      it 'generates description from input values' do
        job_invocation.description_format = '%{job_category} - %{foo}'
        job_invocation.generate_description
        assert_equal "#{job_invocation.job_category} - #{@input_value.value}", job_invocation.description
      end

      it 'handles missing keys correctly' do
        job_invocation.description_format = '%{job_category} - %{missing_key}'
        job_invocation.generate_description
        assert_equal "#{job_invocation.job_category} - ''", job_invocation.description
      end

      it 'truncates generated description to 255 characters' do
        column_limit = 255 # There is a 255 character limit on the database level
        expected_result = 'a' * column_limit
        job_invocation.description_format = '%{job_category}'
        job_invocation.job_category = 'a' * 1000
        job_invocation.generate_description
        assert_equal expected_result, job_invocation.description
      end
    end
  end

  context 'future execution' do
    it 'can report host count' do
      assert_equal 'N/A', job_invocation.total_hosts_count
      job_invocation.targeting.expects(:resolved_at).returns(Time.now.getlocal)
      assert_equal 0, job_invocation.total_hosts_count
    end

    # task does not exist
    specify { assert_equal HostStatus::ExecutionStatus::QUEUED, job_invocation.status }
    specify { assert_equal HostStatus::ExecutionStatus::STATUS_NAMES[HostStatus::ExecutionStatus::QUEUED], job_invocation.status_label }
    specify { assert_equal 0, job_invocation.progress }
  end

  context 'with task' do
    let(:task) { ForemanTasks::Task.new }
    let(:progress_report_without_sub_tasks) do
      {
        :error     => 0,
        :warning   => 0,
        :total     => 0,
        :success   => 0,
        :cancelled => 0,
        :failed    => 0,
        :pending   => 0,
        :progress  => 0,
        :running   => 0,
      }
    end
    before { job_invocation.task = task }

    context 'which is scheduled' do
      before { task.state = 'scheduled' }

      specify { assert_equal HostStatus::ExecutionStatus::QUEUED, job_invocation.status }
      specify { assert_equal true, job_invocation.queued? }
      specify { assert_equal 0, job_invocation.progress }
      specify { assert_equal progress_report_without_sub_tasks, job_invocation.progress_report }
    end

    context 'with cancelled task' do
      before do
        task.state = 'stopped'
        task.result = 'error'
      end

      it 'calculates the progress correctly' do
        job_invocation.targeting.stubs(:resolved?).returns(true)
        task.expects(:sub_tasks_counts).never
        assert_equal progress_report_without_sub_tasks, job_invocation.progress_report
      end
    end

    context 'with succeeded task' do
      before do
        task.state = 'stopped'
        task.result = 'success'
      end

      specify { assert_equal HostStatus::ExecutionStatus::OK, job_invocation.status }
      specify { assert_equal false, job_invocation.queued? }

      it 'calculates the progress correctly' do
        sub_tasks = [ForemanTasks::Task.new]
        job_invocation.targeting.expects(:resolved?).returns(true)
        job_invocation.targeting.expects(:hosts).returns([1])
        sub_tasks.expects(:where).with(:result => %w(success warning error)).returns(sub_tasks)
        job_invocation.stubs(:sub_tasks).returns(sub_tasks)

        assert_equal 100, job_invocation.progress
      end
    end
  end

  describe '#finished?' do
    let(:task) { ForemanTasks::Task.new }
    before { job_invocation.task = task }

    it 'returns false if task state is pending' do
      job_invocation.task.expects(:pending?).returns(true)
      assert_not job_invocation.finished?
    end

    it 'returns true if task is not pending' do
      job_invocation.task.expects(:pending?).returns(false)
      assert job_invocation.finished?
    end
  end

  describe '#failed_hosts' do
    let(:invocation) do
      invocation = FactoryBot.build(:job_invocation, :with_template, :with_task, :with_failed_task, :with_unplanned_host)
      invocation.template_invocations.each { |ti| invocation.targeting.hosts << ti.host }
      invocation.save!
      invocation
    end

    it 'returns only failed hosts when not #finished?' do
      invocation.stubs(:finished?).returns(false)
      assert_equal 1, invocation.failed_hosts.count
    end

    it 'returns failed hosts and hosts without task when #finished?' do
      invocation.stubs(:finished?).returns(true)
      assert_equal 2, invocation.failed_hosts.count
    end

    describe '#failed_template_invocations' do
      it 'finds only failed template invocations' do
        template_invocations = invocation.send(:failed_template_invocations)
        assert_equal 1, template_invocations.count
        template_invocation = template_invocations.first
        assert_equal 'error', template_invocation.run_host_job_task.result
      end
    end

    describe '#not_failed_template_invocations' do
      it 'finds only non-failed template invocations' do
        template_invocations = invocation.send(:not_failed_template_invocations)
        assert_equal 1, template_invocations.count
        template_invocation = template_invocations.first
        assert_equal 'success', template_invocation.run_host_job_task.result
      end
    end
  end
end
