require 'test_plugin_helper'

class JobReportTemplateTest < ActiveSupport::TestCase
  class FakeTask < OpenStruct
    class Jail < Safemode::Jail
      allow :action_continuous_output, :result, :ended_at
    end
  end

  context 'with valid job invocation report template' do
    let(:job_invocation_template) do
      file_path = File.read(File.expand_path(Rails.root + "app/views/unattended/report_templates/job_invocation_-_report_template.erb"))
      template = ReportTemplate.import_without_save("Job Invocation Report Template", file_path)
      template.save!
      template
    end

    describe 'template setting' do
      it 'in settings includes only report templates with job_id input' do
        FactoryBot.create(:report_template, name: 'Template 1')
        job_invocation_template
        templates = ForemanRemoteExecution.job_invocation_report_templates_select

        assert_include templates, 'Job Invocation Report Template'
      end
    end

    describe 'task reporting' do
      let(:fake_outputs) do
        [
          { 'output_type' => 'stderr', 'output' => "error" },
          { 'output_type' => 'stdout', 'output' => "output" },
          { 'output_type' => 'debug', 'output' => "debug" },
        ]
      end
      let(:fake_task) { FakeTask.new(result: 'success', action_continuous_output: fake_outputs, :ended_at => Time.new(2020, 12, 1, 0, 0, 0).utc) }
      let(:job_invocation) { FactoryBot.create(:job_invocation, :with_task) }
      let(:host) { job_invocation.template_invocations.first.host }

      it 'should render task outputs' do
        JobInvocation.any_instance.expects(:sub_task_for_host).returns(fake_task)

        input = job_invocation_template.template_inputs.first
        composer_params = { template_id: job_invocation_template.id, input_values: { input.id.to_s => { value: job_invocation.id.to_s } } }
        result = ReportComposer.new(composer_params).render

        # parsing the CSV result
        rows = CSV.parse(result.strip, headers: true)
        assert_equal 1, rows.count
        row = rows.first
        assert_equal host.name, row['Host']
        assert_equal 'success', row['Result']
        assert_equal 'error', row['stderr']
        assert_equal 'output', row['stdout']
        assert_equal 'debug', row['debug']
        assert_kind_of Time, Time.zone.parse(row['Finished']), 'Parsing of time column failed'
      end
    end
  end
end
