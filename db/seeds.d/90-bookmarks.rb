Bookmark.without_auditing do
  [
    { :name => 'failed', :query => 'status = failed', :controller => 'job_invocations' },
    { :name => 'succeeded', :query => 'status = succeeded', :controller => 'job_invocations'},
    { :name => 'running', :query => 'status = running', :controller => 'job_invocations'},
    { :name => 'pending', :query => 'status = queued or status = running', :controller => 'job_invocations'},
    { :name => 'recurring', :query => 'recurring = true', :controller => 'job_invocations'},
    { :name => 'recent', :query => 'started_at > "24 hours ago"', :controller => 'job_invocations'},
  ].each do |input|
    next if Bookmark.where(:controller => 'job_invocations').find_by(name: input[:name])
    # TODO audit should be fixed once core #13109 gets merged
    next if audit_modified? Bookmark, input[:name]
    attributes = { :public => true }.merge(input)
    b = Bookmark.where(:name => input[:name], :controller => input[:controller]).first || Bookmark.new
    b.attributes = attributes
    b.save
    raise "Unable to create bookmark: #{format_errors b}" if b.errors.any?
  end
end
