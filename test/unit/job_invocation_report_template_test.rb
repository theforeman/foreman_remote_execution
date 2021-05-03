require 'test_plugin_helper'

class JobReportTemplateTest < ActiveSupport::TestCase
  class FakeTask < OpenStruct
    class Jail < Safemode::Jail
      allow :action_continuous_output, :result, :ended_at
    end
  end

  context 'with valid job invocation report template' do
    let(:job_invocation_template) do
      file_path = File.read(File.expand_path(Rails.root + "app/views/unattended/report_templates/jobs_-_invocation_report_template.erb"))
      template = ReportTemplate.import_without_save("Job Invocation Report Template", file_path)
      template.save!
      template
    end

    describe 'template setting' do
      it 'in settings includes only report templates with job_id input' do
        FactoryBot.create(:report_template, name: 'Template 1')
        job_invocation_template
        templates = Setting::RemoteExecution.job_invocation_report_templates_select

        assert_include templates, 'Job Invocation Report Template'
      end
    end

    describe 'task reporting' do
      let(:fake_outputs) do
        [
          { 'output_type' => 'stderr', 'output' => "error", 'timestamp' => Time.new(2020, 12, 1, 0, 0, 0).utc },
          { 'output_type' => 'stdout', 'output' => "output", 'timestamp' => Time.new(2020, 12, 1, 0, 0, 0).utc },
          { 'output_type' => 'stdebug', 'output' => "debug", 'timestamp' => Time.new(2020, 12, 1, 0, 0, 0).utc },
        ]
      end
      let(:fake_task) { FakeTask.new(result: 'success', action_continuous_output: fake_outputs) }

      it 'should render task outputs' do
        job_invocation = FactoryBot.create(:job_invocation, :with_task)
        JobInvocation.any_instance.expects(:sub_task_for_host).returns(fake_task)

        input = job_invocation_template.template_inputs.first
        composer_params = { template_id: job_invocation_template.id, input_values: { input.id.to_s => { value: job_invocation.id.to_s } } }
        result = ReportComposer.new(composer_params).render

        # parsing the CSV result
        CSV.parse(result.strip, headers: true).each_with_index do |row, i|
          row_hash = row.to_h
          assert_equal 'success', row_hash['result']
          assert_equal fake_outputs[i]['output_type'], row_hash['type']
          assert_equal fake_outputs[i]['output'], row_hash['message']
          assert_kind_of Time, Time.zone.parse(row_hash['time']), 'Parsing of time column failed'
        end
      end
    end
  end
end
