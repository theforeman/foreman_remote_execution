require 'test_plugin_helper'

class ExecutionTaskStatusMapperTest < ActiveSupport::TestCase
  describe '.sql_conditions_for(status)' do
    let(:subject) { HostStatus::ExecutionStatus::ExecutionTaskStatusMapper }

    it 'accepts status number as well as string representation' do
      _(subject.sql_conditions_for(HostStatus::ExecutionStatus::ERROR)).must_equal subject.sql_conditions_for('failed')
    end

    it 'does not find any task for unknown state' do
      _(subject.sql_conditions_for(-1)).must_equal [ '1 = 0' ]
    end
  end

  let(:task) { ForemanTasks::Task.new }
  let(:mapper) { HostStatus::ExecutionStatus::ExecutionTaskStatusMapper.new(task) }

  describe '#status' do
    let(:subject) { mapper }

    describe 'is queued' do
      context 'when there is no task' do
        before { subject.task = nil }
        specify { _(subject.status).must_equal HostStatus::ExecutionStatus::QUEUED }
      end

      context 'when the task is scheduled in future' do
        before { subject.task.state = 'scheduled' }
        specify { _(subject.status).must_equal HostStatus::ExecutionStatus::QUEUED }
      end
    end

    context 'when task is stopped' do
      before { subject.task.state = 'stopped' }

      describe 'is succeeded' do
        context 'without error' do
          before { subject.task.result = 'success' }
          specify { _(subject.status).must_equal HostStatus::ExecutionStatus::OK }
        end
      end

      describe 'is failed' do
        context 'with error' do
          before { subject.task.result = 'error' }
          specify { _(subject.status).must_equal HostStatus::ExecutionStatus::ERROR }
        end

        context 'without error but just with warning (sub task failed)' do
          before { subject.task.result = 'warning' }
          specify { _(subject.status).must_equal HostStatus::ExecutionStatus::ERROR }
        end
      end
    end

    context 'when task is pending' do
      before { subject.task.state = 'running' }

      describe 'is pending' do
        specify { _(subject.status).must_equal HostStatus::ExecutionStatus::RUNNING }
      end
    end
  end

  describe '#status_label' do
    let(:subject) { mapper.status_label }

    context 'status is OK' do
      before do
        mapper.task.state = 'stopped'
        mapper.task.result = 'success'
      end

      it 'returns ok label' do
        _(subject).must_equal HostStatus::ExecutionStatus::STATUS_NAMES[HostStatus::ExecutionStatus::OK]
      end
    end

    context 'status is ERROR' do
      before do
        mapper.task.state = 'stopped'
        mapper.task.result = 'error'
      end

      it 'returns failed label' do
        _(subject).must_equal HostStatus::ExecutionStatus::STATUS_NAMES[HostStatus::ExecutionStatus::ERROR]
      end
    end
  end

end
