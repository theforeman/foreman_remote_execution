require 'test_plugin_helper'

class RemoteExecutionHelperTest < ActionView::TestCase
  describe '#normalize_line_sets' do
    let :line_sets do
      [{"output_type"=>"stdout", "output"=>"one", "timestamp"=>1},
       {"output_type"=>"stdout", "output"=>"\r\ntwo\r\n", "timestamp"=>2},
       {"output_type"=>"stdout", "output"=>"\r\nthr", "timestamp"=>3},
       {"output_type"=>"stdout", "output"=>"ee\r\nfour\r\n", "timestamp"=>4},
       {"output_type"=>"stdout", "output"=>"\r\n\r\n", "timestamp"=>5},
       {"output_type"=>"stdout", "output"=>"five\r\n", "timestamp"=>6},
       {"output_type"=>"stdout", "output"=>"Exit status: 0", "timestamp"=>7}]
    end

    it 'ensures the line sets end with new line' do
      new_line_sets = normalize_line_sets(line_sets)
      new_line_sets.map { |s| s['output'] }.must_equal(["one\r\n",
                                                        "two\r\n",
                                                        "\r\nthree\r\n",
                                                        "four\r\n",
                                                        "\r\n\r\n",
                                                        "five\r\n",
                                                        "Exit status: 0"])
    end
  end

  describe 'test correct setting' do
    it 'should found correct template from setting' do
      template_name = 'Job Invocation Report Template'
      setting_key = 'remote_execution_job_invocation_report_template'
      template = FactoryBot.create(:report_template, name: template_name)
      input = FactoryBot.create(:template_input, name: 'job_id', input_type: 'user')
      template.template_inputs << input
      Setting.expects(:[]).with(setting_key).returns(template_name)

      found_template = job_report_template

      assert_equal template.id, found_template.id
    end

    it 'should not crash if the template cannot be found' do
      assert_nil job_report_template
    end
  end
end
