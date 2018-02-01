module JobInvocationOutputHelper
  CONSOLE_COLOR = {
    '31' => 'red',
    '32' => 'lightgreen',
    '33' => 'orange',
    '34' => 'deepskyblue',
    '35' => 'mediumpurple',
    '36' => 'cyan',
    '37' => 'grey',
    '91' => 'red',
    '92' => 'lightgreen',
    '93' => 'yellow',
    '94' => 'lightblue',
    '95' => 'violet',
    '96' => 'turquoise',
    '0'  => 'default',
  }.tap { |h| h.default = 'default' }.freeze

  def colorize_line(line)
    line = line.gsub(/\e\[.*?m/) do |seq|
      color = seq[/(\d+)m/,1]
      "{{{format color:#{color}}}}"
    end

    current_color = 'default'
    out = %{<span style="color: #{@current_color}">}
    parts = line.split(/({{{format.*?}}})/)
    parts.each do |console_line|
      if console_line.include?('{{{format')
        if (color_index = console_line[/color:(\d+)/, 1]).present?
          current_color = CONSOLE_COLOR[color_index]
          out << %{</span><span style="color: #{current_color}">}
        end
      else
        out << h(console_line)
      end
    end
    out << %{</span>}
    out
  end
end
