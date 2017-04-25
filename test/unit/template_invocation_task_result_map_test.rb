require 'test_plugin_helper'

describe TemplateInvocation do
  describe TemplateInvocation::TaskResultMap do
    it 'maps status to result' do
      TemplateInvocation::TaskResultMap.status_to_task_result(:failed).must_equal [:error, :warning]
      TemplateInvocation::TaskResultMap.status_to_task_result('failed').must_equal [:error, :warning]
      TemplateInvocation::TaskResultMap.status_to_task_result(:success).must_equal [:success]
      TemplateInvocation::TaskResultMap.status_to_task_result('success').must_equal [:success]
    end

    it 'maps result to status' do
      TemplateInvocation::TaskResultMap.task_result_to_status(:error).must_equal :failed
      TemplateInvocation::TaskResultMap.task_result_to_status('error').must_equal :failed
      TemplateInvocation::TaskResultMap.task_result_to_status(:success).must_equal :success
      TemplateInvocation::TaskResultMap.task_result_to_status('success').must_equal :success
    end

    it 'raises on unknown key' do
      key = 'unknown'
      TemplateInvocation::TaskResultMap.task_result_to_status(key).must_equal key
      TemplateInvocation::TaskResultMap.status_to_task_result(key).must_equal [key]
    end
  end
end
