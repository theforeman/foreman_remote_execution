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
end
