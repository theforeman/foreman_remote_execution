module JobInvocationOutputHelper

  def colorize_line(line)
    line = line.gsub(/\e\[.*?m/) { |seq| color = seq[/(\d+)m/,1]; "{{{format color:#{color}}}}" }

    @current_color ||= 'default'
    out = %{<span style="color: #{@current_color}">}
    parts = line.split(/({{{format.*?}}})/)
    parts.each do |line|
      if line.include?('{{{format')
        if color_index = line[/color:(\d+)/, 1]
          @current_color = case color_index
                           when '31'
                             'red'
                           when '32'
                             'green'
                           when '33'
                             'orange'
                           when '0'
                             'default'
                           else
                             'default'
                           end
          out << %{</span><span style="color: #{@current_color}">}
        end
      else
        out << line
      end
    end
    out << %{</span>}
    out
  end
end
