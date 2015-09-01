User.as_anonymous_admin do
  JobTemplate.without_auditing do
    Dir[File.join("#{ForemanRemoteExecution::Engine.root}/app/views/templates/**/*.erb")].each do |template|
      JobTemplate.import(File.read(template), :default => true, :locked => true)
    end
  end
end
