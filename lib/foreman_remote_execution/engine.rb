module ForemanRemoteExecution
  DYNFLOW_QUEUE = :remote_execution

  class Engine < ::Rails::Engine
    engine_name 'foreman_remote_execution'

    # Precompile any JS or CSS files under app/assets/
    # If requiring files from each other, list them explicitly here to avoid precompiling the same
    # content twice.
    def self.assets_to_precompile
      assets = Dir.chdir(root) do
        Dir['app/assets/javascripts/**/*'].map do |f|
          f.split(File::SEPARATOR, 4).last
        end
      end
      assets << 'foreman_remote_execution/foreman_remote_execution.css'
    end

    # Add any db migrations
    initializer 'foreman_remote_execution.load_app_instance_data' do |app|
      ForemanRemoteExecution::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_remote_execution.apipie' do
      Apipie.configuration.checksum_path += ['/api/']
    end

    initializer 'foreman_remote_execution.require_dynflow', :before => 'foreman_tasks.initialize_dynflow' do |app|
      ForemanTasks.dynflow.require!
      ForemanTasks.dynflow.config.queues.add(DYNFLOW_QUEUE)
      ForemanTasks.dynflow.config.eager_load_paths << File.join(ForemanRemoteExecution::Engine.root, 'app/lib/actions')
    end

    initializer 'foreman_remote_execution.register_plugin', before: :finisher_hook do |app|
      app.reloader.to_prepare do
        # Allow plugin registration to call application code once on boot
        require_relative 'plugin'
      end
    end

    initializer 'foreman_remote_execution.assets.precompile' do |app|
      app.config.assets.precompile += Engine.assets_to_precompile
    end
    initializer 'foreman_remote_execution.configure_assets', group: :assets do
      SETTINGS[:foreman_remote_execution] = { assets: { precompile: Engine.assets_to_precompile } }
    end

    # Include concerns in this config.to_prepare block
    config.to_prepare do
      # we have to define associations in Template and all descendants because
      # reflect_on_association does not work when we add association after parent and child class
      # are already loaded, causing issues when you try to destroy any child which iterates
      # over all associations because of :dependant => :destroy
      #
      # e.g. having ProvisioningTemplate < Template, adding has_many :template_inputs to Template from concern
      #   Template.reflect_on_association :template_inputs # => <#Association...
      #   ProvisioningTemplate.reflect_on_association :template_inputs # => nil
      (Template.descendants + [Template]).each { |klass| klass.send(:include, ForemanRemoteExecution::TemplateExtensions) }
      Template.prepend ForemanRemoteExecution::TemplateOverrides

      (Taxonomy.descendants + [Taxonomy]).each { |klass| klass.send(:include, ForemanRemoteExecution::TaxonomyExtensions) }

      User.include ForemanRemoteExecution::UserExtensions

      Host::Managed.prepend ForemanRemoteExecution::HostExtensions
      Host::Managed.include ForemanTasks::Concerns::HostActionSubject

      (Nic::Base.descendants + [Nic::Base]).each do |klass|
        klass.send(:include, ForemanRemoteExecution::NicExtensions)
      end

      Bookmark.include ForemanRemoteExecution::BookmarkExtensions
      ProvisioningTemplatesHelper.prepend ForemanRemoteExecution::JobTemplatesExtensions
      TemplateInput.include ForemanRemoteExecution::TemplateInputExtensions

      SmartProxy.prepend ForemanRemoteExecution::SmartProxyExtensions
      Subnet.include ForemanRemoteExecution::SubnetExtensions

      ::Api::V2::InterfacesController.include Api::V2::InterfacesControllerExtensions
      # We need to explicitly force to load the Task model due to Rails loader
      # having issues with resolving it to Rake::Task otherwise
      ForemanTasks::Task.include ForemanRemoteExecution::ForemanTasksTaskExtensions
      ForemanTasks::Cleaner.include ForemanRemoteExecution::ForemanTasksCleanerExtensions
      RemoteExecutionProvider.register(:SSH, ::ScriptExecutionProvider)
      RemoteExecutionProvider.register(:script, ::ScriptExecutionProvider)

      ForemanRemoteExecution.register_rex_feature

      ::Api::V2::HostsController.include Api::V2::HostsControllerExtensions
      ::Api::V2::SubnetsController.include ::ForemanRemoteExecution::Concerns::Api::V2::SubnetsControllerExtensions
      ::Api::V2::RegistrationController.prepend ::ForemanRemoteExecution::Concerns::Api::V2::RegistrationControllerExtensions
      ::Api::V2::RegistrationController.include ::ForemanRemoteExecution::Concerns::Api::V2::RegistrationControllerExtensions::ApipieExtensions
      ::Api::V2::RegistrationCommandsController.include ::ForemanRemoteExecution::Concerns::Api::V2::RegistrationCommandsControllerExtensions::ApipieExtensions
    end

    rake_tasks do
      %w[explain_proxy_selection.rake].each do |rake_file|
        full_path = File.expand_path("../tasks/#{rake_file}", __FILE__)
        load full_path if File.exist?(full_path)
      end
    end
  end

  def self.job_invocation_report_templates_select
    Hash[ReportTemplate.unscoped.joins(:template_inputs).where(template_inputs: TemplateInput.where(name: 'job_id')).map { |template| [template.name, template.name] }]
  end

  def self.register_rex_feature
    RemoteExecutionFeature.register(
      :puppet_run_host,
      N_('Run Puppet Once'),
      :description => N_('Perform a single Puppet run'),
      :host_action_button => true
    )
    RemoteExecutionFeature.register(
      :run_script,
      N_('Run Script'),
      :description => N_('Run a script')
    )
  end
end
