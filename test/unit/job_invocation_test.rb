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
      _(found_jobs).must_equal [job_invocation]
    end

    it 'is able to auto complete description' do
      expected = 'description =  "A text with \"quotes\""'
      JobInvocation.complete_for('description = ').must_equal [expected]
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
      _(job_invocation.template_invocations).must_be_empty
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
        _(job_invocation.description).must_equal "#{job_invocation.job_category} - #{@input_value.value}"
      end

      it 'handles missing keys correctly' do
        job_invocation.description_format = '%{job_category} - %{missing_key}'
        job_invocation.generate_description
        _(job_invocation.description).must_equal "#{job_invocation.job_category} - ''"
      end

      it 'truncates generated description to 255 characters' do
        column_limit = 255
        expected_result = 'a' * column_limit
        JobInvocation.columns_hash['description'].expects(:limit).returns(column_limit)
        job_invocation.description_format = '%{job_category}'
        job_invocation.job_category = 'a' * 1000
        job_invocation.generate_description
        _(job_invocation.description).must_equal expected_result
      end
    end
  end

  context 'future execution' do
    it 'can report host count' do
      _(job_invocation.total_hosts_count).must_equal 'N/A'
      job_invocation.targeting.expects(:resolved_at).returns(Time.now.getlocal)
      _(job_invocation.total_hosts_count).must_equal 0
    end

    # task does not exist
    specify { _(job_invocation.status).must_equal HostStatus::ExecutionStatus::QUEUED }
    specify { _(job_invocation.status_label).must_equal HostStatus::ExecutionStatus::STATUS_NAMES[HostStatus::ExecutionStatus::QUEUED] }
    specify { _(job_invocation.progress).must_equal 0 }
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
      }
    end
    before { job_invocation.task = task }

    context 'which is scheduled' do
      before { task.state = 'scheduled' }

      specify { _(job_invocation.status).must_equal HostStatus::ExecutionStatus::QUEUED }
      specify { _(job_invocation.queued?).must_equal true }
      specify { _(job_invocation.progress).must_equal 0 }
      specify { _(job_invocation.progress_report).must_equal progress_report_without_sub_tasks }
    end

    context 'with cancelled task' do
      before do
        task.state = 'stopped'
        task.result = 'error'
      end

      it 'calculates the progress correctly' do
        job_invocation.targeting.stubs(:resolved?).returns(true)
        task.expects(:sub_tasks_counts).never
        _(job_invocation.progress_report).must_equal progress_report_without_sub_tasks
      end
    end

    context 'with succeeded task' do
      before do
        task.state = 'stopped'
        task.result = 'success'
      end

      specify { _(job_invocation.status).must_equal HostStatus::ExecutionStatus::OK }
      specify { _(job_invocation.queued?).must_equal false }

      it 'calculates the progress correctly' do
        sub_tasks = [ForemanTasks::Task.new]
        job_invocation.targeting.expects(:resolved?).returns(true)
        job_invocation.targeting.expects(:hosts).returns([1])
        sub_tasks.expects(:where).with(:result => %w(success warning error)).returns(sub_tasks)
        job_invocation.stubs(:sub_tasks).returns(sub_tasks)

        _(job_invocation.progress).must_equal 100
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
      _(invocation.failed_hosts.count).must_equal 1
    end

    it 'returns failed hosts and hosts without task when #finished?' do
      invocation.stubs(:finished?).returns(true)
      _(invocation.failed_hosts.count).must_equal 2
    end

    describe '#failed_template_invocations' do
      it 'finds only failed template invocations' do
        template_invocations = invocation.send(:failed_template_invocations)
        _(template_invocations.count).must_equal 1
        template_invocation = template_invocations.first
        _(template_invocation.run_host_job_task.result).must_equal 'error'
      end
    end

    describe '#not_failed_template_invocations' do
      it 'finds only non-failed template invocations' do
        template_invocations = invocation.send(:not_failed_template_invocations)
        _(template_invocations.count).must_equal 1
        template_invocation = template_invocations.first
        _(template_invocation.run_host_job_task.result).must_equal 'success'
      end
    end
  end
end
