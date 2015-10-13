ProvisioningTemplate.without_auditing do
  templates = [{:name => "remote_execution_ssh_keys", :source => "snippets/_remote_execution_ssh_keys.erb", :snippet => true}]

  defaults = {:vendor => "Remote Execution", :default => true, :locked => true}

  templates.each do |template|
    next if ProvisioningTemplate.find_by_name(template[:name])

    template.merge!(defaults)

    t= ProvisioningTemplate.create({
      :snippet => false,
      :template => File.read(File.join("#{ForemanRemoteExecution::Engine.root}/app/views/unattended", template.delete(:source)))
    }.merge(template))

    t.organizations << (Organization.all - t.organizations)
    t.locations << (Location.all - t.locations)

    raise "Unable to create template #{t.name}: #{format_errors t}" if t.nil? || t.errors.any?
  end
end
