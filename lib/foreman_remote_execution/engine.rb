module ForemanRemoteExecution
  DYNFLOW_QUEUE = :remote_execution

  class Engine < ::Rails::Engine
    engine_name 'foreman_remote_execution'

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]

    # Precompile any JS or CSS files under app/assets/
    # If requiring files from each other, list them explicitly here to avoid precompiling the same
    # content twice.
    assets_to_precompile =
      Dir.chdir(root) do
        Dir['app/assets/javascripts/**/*'].map do |f|
          f.split(File::SEPARATOR, 4).last
        end
      end
    assets_to_precompile += %w(foreman_remote_execution/foreman_remote_execution.css)

    # Add any db migrations
    initializer 'foreman_remote_execution.load_app_instance_data' do |app|
      ForemanRemoteExecution::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    # A workaround for https://projects.theforeman.org/issues/30685
    initializer 'foreman_remote_execution.rails_loading_workaround' do
      # Without this, in production environment the module gets prepended too
      # late and the extensions do not get applied
      # TODO: Remove this and from config.to_prepare once there is an extension
      # point in Foreman
      ProvisioningTemplatesHelper.prepend ForemanRemoteExecution::JobTemplatesExtensions
    end

    initializer 'foreman_remote_execution.apipie' do
      Apipie.configuration.checksum_path += ['/api/']
    end

    initializer 'foreman_remote_execution.require_dynflow', :before => 'foreman_tasks.initialize_dynflow' do |app|
      ForemanTasks.dynflow.require!
      ForemanTasks.dynflow.config.queues.add(DYNFLOW_QUEUE, :pool_size => Setting['remote_execution_workers_pool_size']) if Setting.table_exists? rescue(false)
      ForemanTasks.dynflow.config.eager_load_paths << File.join(ForemanRemoteExecution::Engine.root, 'app/lib/actions')
    end

    initializer 'foreman_remote_execution.register_plugin', before: :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_remote_execution do
        requires_foreman '>= 3.4'
        register_global_js_file 'global'

        apipie_documented_controllers ["#{ForemanRemoteExecution::Engine.root}/app/controllers/api/v2/*.rb"]
        ApipieDSL.configuration.dsl_classes_matchers += [
          "#{ForemanRemoteExecution::Engine.root}/app/lib/foreman_remote_execution/renderer/**/*.rb",
        ]
        automatic_assets(false)
        precompile_assets(*assets_to_precompile)

        # Add settings to a Remote Execution category
        settings do
          category :remote_execution, N_('Remote Execution') do
            setting 'remote_execution_fallback_proxy',
              type: :boolean,
              description: N_('Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy'),
              default: false,
              full_name: N_('Fallback to Any Proxy')
            setting 'remote_execution_global_proxy',
              type: :boolean,
              description: N_('Search for remote execution proxy outside of the proxies assigned to the host. The search will be limited to the host\'s organization and location.'),
              default: true,
              full_name: N_('Enable Global Proxy')
            setting 'remote_execution_ssh_user',
              type: :string,
              description: N_('Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.'),
              default: 'root',
              full_name: N_('SSH User')
            setting 'remote_execution_effective_user',
              type: :string,
              description: N_('Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.'),
              default: 'root',
              full_name: N_('Efffective User')
            setting 'remote_execution_effective_user_method',
              type: :string,
              description: N_('What command should be used to switch to the effective user. One of %s') % SSHExecutionProvider::EFFECTIVE_USER_METHODS.inspect,
              default: 'sudo',
              full_name: N_('Effective User Method'),
              collection: proc { Hash[SSHExecutionProvider::EFFECTIVE_USER_METHODS.map { |method| [method, method] }] }
            setting 'remote_execution_effective_user_password',
              type: :string,
              description: N_('Effective user password'),
              default: '',
              full_name: N_('Effective user password'),
              encrypted: true
            setting 'remote_execution_sync_templates',
              type: :boolean,
              description: N_('Whether we should sync templates from disk when running db:seed.'),
              default: true,
              full_name: N_('Sync Job Templates')
            setting 'remote_execution_ssh_port',
              type: :integer,
              description: N_('Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.'),
              default: 22,
              full_name: N_('SSH Port')
            setting 'remote_execution_connect_by_ip',
              type: :boolean,
              description: N_('Should the ip addresses on host interfaces be preferred over the fqdn? '\
                              'It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. '\
                              'For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting'),
              default: false,
              full_name: N_('Connect by IP')
            setting 'remote_execution_connect_by_ip_prefer_ipv6',
              type: :boolean,
              description: N_('When connecting using ip address, should the IPv6 addresses be preferred? '\
                              'If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. '\
                              'By default and for compatibility, IPv4 will be preferred over IPv6 by default'),
              default: false,
              full_name: N_('Prefer IPv6 over IPv4')
            setting 'remote_execution_ssh_password',
              type: :string,
              description: N_('Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password'),
              default: nil,
              full_name: N_('Default SSH password'),
              encrypted: true
            setting 'remote_execution_ssh_key_passphrase',
              type: :string,
              description: N_('Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase'),
              default: nil,
              full_name: N_('Default SSH key passphrase'),
              encrypted: true
            setting 'remote_execution_workers_pool_size',
              type: :integer,
              description: N_('Amount of workers in the pool to handle the execution of the remote execution jobs. Restart of the dynflowd/foreman-tasks service is required.'),
              default: 5,
              full_name: N_('Workers pool size')
            setting 'remote_execution_cleanup_working_dirs',
              type: :boolean,
              description: N_('When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.'),
              default: true,
              full_name: N_('Cleanup working directories')
            setting 'remote_execution_cockpit_url',
              type: :string,
              description: N_('Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.'),
              default: nil,
              full_name: N_('Cockpit URL')
            setting 'remote_execution_form_job_template',
              type: :string,
              description: N_('Choose a job template that is pre-selected in job invocation form'),
              default: 'Run Command - Script Default',
              full_name: N_('Form Job Template'),
              collection: proc { Hash[JobTemplate.unscoped.map { |template| [template.name, template.name] }] }
            setting 'remote_execution_job_invocation_report_template',
              type: :string,
              description: N_('Select a report template used for generating a report for a particular remote execution job'),
              default: 'Job - Invocation Report',
              full_name: N_('Job Invocation Report Template'),
              collection: proc { ForemanRemoteExecution.job_invocation_report_templates_select }
            setting 'remote_execution_time_to_pickup',
              type: :integer,
              description: N_('Time in seconds within which the host has to pick up a job. If the job is not picked up within this limit, the job will be cancelled. Defaults to 1 day.'),
              default: 24 * 60 * 60,
              full_name: N_('Time to pickup')
          end
        end

        # Add permissions
        security_block :foreman_remote_execution do
          permission :view_job_templates, { :job_templates => [:index, :show, :revision, :auto_complete_search, :auto_complete_job_category, :preview, :export],
                                            :'api/v2/job_templates' => [:index, :show, :revision, :export],
                                            :'api/v2/template_inputs' => [:index, :show],
                                            :'api/v2/foreign_input_sets' => [:index, :show],
                                            :ui_job_wizard => [:categories, :template, :resources, :job_invocation]}, :resource_type => 'JobTemplate'
          permission :create_job_templates, { :job_templates => [:new, :create, :clone_template, :import],
                                              :'api/v2/job_templates' => [:create, :clone, :import] }, :resource_type => 'JobTemplate'
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
                                                'api/v2/job_invocations' => [:create, :rerun] }, :resource_type => 'JobInvocation'
          permission :view_job_invocations, { :job_invocations => [:index, :chart, :show, :auto_complete_search], :template_invocations => [:show],
                                              'api/v2/job_invocations' => [:index, :show, :output, :raw_output, :outputs] }, :resource_type => 'JobInvocation'
          permission :view_template_invocations, { :template_invocations => [:show],
                                                   'api/v2/template_invocations' => [:template_invocations], :ui_job_wizard => [:job_invocation] }, :resource_type => 'TemplateInvocation'
          permission :create_template_invocations, {}, :resource_type => 'TemplateInvocation'
          permission :execute_jobs_on_infrastructure_hosts, {}, :resource_type => 'JobInvocation'
          permission :cancel_job_invocations, { :job_invocations => [:cancel], 'api/v2/job_invocations' => [:cancel] }, :resource_type => 'JobInvocation'
          # this permissions grants user to get auto completion hints when setting up filters
          permission :filter_autocompletion_for_template_invocation, { :template_invocations => [ :auto_complete_search, :index ] },
            :resource_type => 'TemplateInvocation'
          permission :cockpit_hosts, { 'cockpit' => [:redirect, :host_ssh_params] }, :resource_type => 'Host'
        end

        USER_PERMISSIONS = [
          :view_job_templates,
          :view_job_invocations,
          :create_job_invocations,
          :create_template_invocations,
          :view_hosts,
          :view_smart_proxies,
        ].freeze
        MANAGER_PERMISSIONS = USER_PERMISSIONS + [
          :cancel_job_invocations,
          :destroy_job_templates,
          :edit_job_templates,
          :create_job_templates,
          :lock_job_templates,
          :view_audit_logs,
          :filter_autocompletion_for_template_invocation,
          :edit_remote_execution_features,
        ]

        # Add a new role called 'Remote Execution User ' if it doesn't exist
        role 'Remote Execution User', USER_PERMISSIONS, 'Role with permissions to run remote execution jobs against hosts'
        role 'Remote Execution Manager', MANAGER_PERMISSIONS, 'Role with permissions to manage job templates, remote execution features, cancel jobs and view audit logs'

        add_all_permissions_to_default_roles(except: [:execute_jobs_on_infrastructure_hosts])
        add_permissions_to_default_roles({
          Role::MANAGER => [:execute_jobs_on_infrastructure_hosts],
          Role::SITE_MANAGER => USER_PERMISSIONS + [:execute_jobs_on_infrastructure_hosts],
        })

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

        menu :labs_menu, :job_wizard,
          url_hash: { controller: 'job_wizard', action: :index },
          caption: N_('Job wizard'),
          parent: :lab_features_menu,
          url: '/experimental/job_wizard/new',
          after: :host_wizard

        register_custom_status HostStatus::ExecutionStatus
        # add dashboard widget
        # widget 'foreman_remote_execution_widget', name: N_('Foreman plugin template widget'), sizex: 4, sizey: 1
        widget 'dashboard/latest-jobs', :name => N_('Latest Jobs'), :sizex => 6, :sizey => 1

        parameter_filter Subnet, :remote_execution_proxies, :remote_execution_proxy_ids => []
        parameter_filter Nic::Interface do |ctx|
          ctx.permit :execution
        end

        register_graphql_query_field :job_invocations, '::Types::JobInvocation', :collection_field
        register_graphql_query_field :job_invocation, '::Types::JobInvocation', :record_field

        register_graphql_mutation_field :create_job_invocation, ::Mutations::JobInvocations::Create

        extend_template_helpers ForemanRemoteExecution::RendererMethods

        extend_rabl_template 'api/v2/smart_proxies/main', 'api/v2/smart_proxies/pubkey'
        extend_rabl_template 'api/v2/interfaces/main', 'api/v2/interfaces/execution_flag'
        extend_rabl_template 'api/v2/subnets/show', 'api/v2/subnets/remote_execution_proxies'
        extend_rabl_template 'api/v2/hosts/main', 'api/v2/host/main'
        parameter_filter ::Subnet, :remote_execution_proxy_ids

        describe_host do
          multiple_actions_provider :rex_hosts_multiple_actions
          overview_buttons_provider :rex_host_overview_buttons
        end

        # Extend Registration module
        extend_allowed_registration_vars :remote_execution_interface
        extend_allowed_registration_vars :setup_remote_execution_pull
        ForemanTasks.dynflow.eager_load_actions!
        extend_observable_events(
          ::Dynflow::Action.descendants.select do |klass|
            klass <= ::Actions::ObservableAction
          end.map(&:namespaced_event_names) +
          RemoteExecutionFeature.all.pluck(:label).map do |label|
            ::Actions::RemoteExecution::RunHostJob.feature_job_event_name(label)
          end
        )
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
      require_dependency 'foreman_tasks/task'
      ForemanTasks::Task.include ForemanRemoteExecution::ForemanTasksTaskExtensions
      ForemanTasks::Cleaner.include ForemanRemoteExecution::ForemanTasksCleanerExtensions
      RemoteExecutionProvider.register(:SSH, ::SSHExecutionProvider)
      RemoteExecutionProvider.register(:script, ::ScriptExecutionProvider)

      ForemanRemoteExecution.register_rex_feature

      ::Api::V2::SubnetsController.include ::ForemanRemoteExecution::Concerns::Api::V2::SubnetsControllerExtensions
      ::Api::V2::RegistrationController.prepend ::ForemanRemoteExecution::Concerns::Api::V2::RegistrationControllerExtensions
      ::Api::V2::RegistrationController.include ::ForemanRemoteExecution::Concerns::Api::V2::RegistrationControllerExtensions::ApipieExtensions
      ::Api::V2::RegistrationCommandsController.include ::ForemanRemoteExecution::Concerns::Api::V2::RegistrationCommandsControllerExtensions::ApipieExtensions
    end

    initializer 'foreman_remote_execution.register_gettext', after: :load_config_initializers do |_app|
      locale_dir = File.join(File.expand_path('../../..', __FILE__), 'locale')
      locale_domain = 'foreman_remote_execution'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
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
  end
end
