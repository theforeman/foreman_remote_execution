require 'test_plugin_helper'

class ExecutionTaskStatusMapperTest < ActiveSupport::TestCase
  describe '.sql_conditions_for(status)' do
    let(:subject) { HostStatus::ExecutionStatus::ExecutionTaskStatusMapper }

    it 'accepts status number as well as string representation' do
      assert_equal subject.sql_conditions_for('failed'), subject.sql_conditions_for(HostStatus::ExecutionStatus::ERROR)
    end

    it 'does not find any task for unknown state' do
      assert_equal [ '1 = 0' ], subject.sql_conditions_for(-1)
    end
  end

  let(:task) { ForemanTasks::Task.new }
  let(:mapper) { HostStatus::ExecutionStatus::ExecutionTaskStatusMapper.new(task) }

  describe '#status' do
    let(:subject) { mapper }

    describe 'is queued' do
      context 'when there is no task' do
        before { subject.task = nil }
        specify { assert_equal HostStatus::ExecutionStatus::QUEUED, subject.status }
      end

      context 'when the task is scheduled in future' do
        before { subject.task.state = 'scheduled' }
        specify { assert_equal HostStatus::ExecutionStatus::QUEUED, subject.status }
      end
    end

    context 'when task is stopped' do
      before { subject.task.state = 'stopped' }

      describe 'is succeeded' do
        context 'without error' do
          before { subject.task.result = 'success' }
          specify { assert_equal HostStatus::ExecutionStatus::OK, subject.status }
        end
      end

      describe 'is failed' do
        context 'with error' do
          before { subject.task.result = 'error' }
          specify { assert_equal HostStatus::ExecutionStatus::ERROR, subject.status }
        end

        context 'without error but just with warning (sub task failed)' do
          before { subject.task.result = 'warning' }
          specify { assert_equal HostStatus::ExecutionStatus::ERROR, subject.status }
        end
      end
    end

    context 'when task is pending' do
      before { subject.task.state = 'running' }

      describe 'is pending' do
        specify { assert_equal HostStatus::ExecutionStatus::RUNNING, subject.status }
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
        assert_equal HostStatus::ExecutionStatus::STATUS_NAMES[HostStatus::ExecutionStatus::OK], subject
      end
    end

    context 'status is ERROR' do
      before do
        mapper.task.state = 'stopped'
        mapper.task.result = 'error'
      end

      it 'returns failed label' do
        assert_equal HostStatus::ExecutionStatus::STATUS_NAMES[HostStatus::ExecutionStatus::ERROR], subject
      end
    end
  end

end
