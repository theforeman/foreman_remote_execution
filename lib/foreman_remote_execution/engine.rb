module ForemanRemoteExecution
  class Engine < ::Rails::Engine
    engine_name 'foreman_remote_execution'

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]


    initializer 'foreman_remote_execution.load_default_settings', :before => :load_config_initializers do
      require_dependency File.expand_path('../../../app/models/setting/remote_execution.rb', __FILE__) if (Setting.table_exists? rescue(false))
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
      ForemanTasks.dynflow.config.eager_load_paths << File.join(ForemanRemoteExecution::Engine.root, 'app/lib/actions')
    end

    initializer 'foreman_remote_execution.register_plugin', :before => :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_remote_execution do
        requires_foreman '>= 1.11'

        apipie_documented_controllers ["#{ForemanRemoteExecution::Engine.root}/app/controllers/api/v2/*.rb"]

        # Add permissions
        security_block :foreman_remote_execution do
          permission :view_job_templates, { :job_templates => [:index, :show, :revision, :auto_complete_search, :auto_complete_job_category, :preview],
                                            :'api/v2/job_templates' => [:index, :show, :revision],
                                            :'api/v2/template_inputs' => [:index, :show],
                                            :'api/v2/foreign_input_sets' => [:index, :show]}, :resource_type => 'JobTemplate'
          permission :create_job_templates, { :job_templates => [:new, :create, :clone_template],
                                              :'api/v2/job_templates' => [:create, :clone] }, :resource_type => 'JobTemplate'
          permission :edit_job_templates, { :job_templates => [:edit, :update],
                                            :'api/v2/job_templates' => [:update],
                                            :'api/v2/template_inputs' => [:create, :update, :destroy],
                                            :'api/v2/foreign_input_sets' => [:create, :update, :destroy]}, :resource_type => 'JobTemplate'
          permission :edit_remote_execution_features, { :remote_execution_features => [:index, :show, :update],
                                                        :'api/v2/remote_execution_features' => [:index, :show, :update]}, :resource_type => 'RemoteExecutionFeature'
          permission :destroy_job_templates, { :job_templates => [:destroy],
                                               :'api/v2/job_templates' => [:destroy] }, :resource_type => 'JobTemplate'
          permission :lock_job_templates, { :job_templates => [:lock, :unlock] }, :resource_type => 'JobTemplate'
          permission :create_job_invocations, { :job_invocations => [:new, :create, :refresh, :rerun, :preview_hosts],
                                                'api/v2/job_invocations' => [:create] }, :resource_type => 'JobInvocation'
          permission :view_job_invocations, { :job_invocations => [:index, :show, :auto_complete_search], :template_invocations => [:show],
                                              'api/v2/job_invocations' => [:index, :show, :output] }, :resource_type => 'JobInvocation'
          permission :execute_template_invocation, {}, :resource_type => 'TemplateInvocation'
          # this permissions grants user to get auto completion hints when setting up filters
          permission :filter_autocompletion_for_template_invocation, { :template_invocations => [ :auto_complete_search, :index ] },
                     :resource_type => 'TemplateInvocation'
        end

        USER_PERMISSIONS = [
          :view_job_templates,
          :view_job_invocations,
          :create_job_invocations,
          :execute_template_invocation,
          :view_hosts,
          :view_smart_proxies
        ]
        MANAGER_PERMISSIONS = USER_PERMISSIONS + [
          :destroy_job_templates,
          :edit_job_templates,
          :create_job_templates,
          :lock_job_templates,
          :view_audit_logs,
          :filter_autocompletion_for_template_invocation,
          :edit_remote_execution_features
        ]

        # Add a new role called 'Remote Execution User ' if it doesn't exist
        role 'Remote Execution User', USER_PERMISSIONS
        role 'Remote Execution Manager', MANAGER_PERMISSIONS

        # add menu entry
        menu :top_menu, :job_templates,
             url_hash: { controller: :job_templates, action: :index },
             caption: N_('Job templates'),
             parent: :hosts_menu,
             after: :provisioning_templates
        menu :admin_menu, :remote_execution_features,
             url_hash: { controller: :remote_execution_features, action: :index },
             caption: N_('Remote Execution Features'),
             parent: :administer_menu,
             after: :bookmarks

        menu :top_menu, :job_invocations,
             url_hash: { controller: :job_invocations, action: :index },
             caption: N_('Jobs'),
             parent: :monitor_menu,
             after: :audits

        register_custom_status HostStatus::ExecutionStatus
        # add dashboard widget
        # widget 'foreman_remote_execution_widget', name: N_('Foreman plugin template widget'), sizex: 4, sizey: 1
      end
    end

    # Precompile any JS or CSS files under app/assets/
    # If requiring files from each other, list them explicitly here to avoid precompiling the same
    # content twice.
    assets_to_precompile =
      Dir.chdir(root) do
        Dir['app/assets/javascripts/**/*', 'app/assets/stylesheets/**/*'].map do |f|
          f.split(File::SEPARATOR, 4).last.gsub(/\.scss\Z/, '')
        end
      end
    initializer 'foreman_remote_execution.assets.precompile' do |app|
      app.config.assets.precompile += assets_to_precompile
    end
    initializer 'foreman_remote_execution.configure_assets', group: :assets do
      SETTINGS[:foreman_remote_execution] = { assets: { precompile: assets_to_precompile } }
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
      require_dependency 'job_template'
      (Template.descendants + [Template]).each { |klass| klass.send(:include, ForemanRemoteExecution::TemplateExtensions) }

      (Taxonomy.descendants + [Taxonomy]).each { |klass| klass.send(:include, ForemanRemoteExecution::TaxonomyExtensions) }

      User.send(:include, ForemanRemoteExecution::UserExtensions)

      Host::Managed.send(:include, ForemanRemoteExecution::HostExtensions)
      Host::Managed.send(:include, ForemanTasks::Concerns::HostActionSubject)

      (Nic::Base.descendants + [Nic::Base]).each do |klass|
        klass.send(:include, ForemanRemoteExecution::NicExtensions)
      end

      Bookmark.send(:include, ForemanRemoteExecution::BookmarkExtensions)
      HostsHelper.send(:include, ForemanRemoteExecution::HostsHelperExtensions)
      ProvisioningTemplatesHelper.send(:include, ForemanRemoteExecution::JobTemplatesExtensions)

      SmartProxy.send(:include, ForemanRemoteExecution::SmartProxyExtensions)
      Subnet.send(:include, ForemanRemoteExecution::SubnetExtensions)

      # We need to explicitly force to load the Task model due to Rails loader
      # having issues with resolving it to Rake::Task otherwise
      require_dependency 'foreman_tasks/task'
      ForemanTasks::Task.send(:include, ForemanRemoteExecution::ForemanTasksTaskExtensions)
      RemoteExecutionProvider.register(:SSH, SSHExecutionProvider)
      RemoteExecutionProvider.register(:Ansible, AnsibleProvider)
    end

    initializer 'foreman_remote_execution.register_gettext', after: :load_config_initializers do |_app|
      locale_dir = File.join(File.expand_path('../../..', __FILE__), 'locale')
      locale_domain = 'foreman_remote_execution'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end
  end
end
