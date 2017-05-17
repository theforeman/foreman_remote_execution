User.as_anonymous_admin do
  JobTemplate.without_auditing do
    Dir[File.join("#{ForemanRemoteExecution::Engine.root}/app/views/templates/**/*.erb")].each do |template|
      sync = !Rails.env.test? && Setting[:remote_execution_sync_templates]
      JobTemplate.import_raw!(File.read(template), :default => true, :locked => true, :update => sync)
    end
  end
end
