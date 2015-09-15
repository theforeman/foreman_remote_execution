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
      app.config.paths['db/migrate'] += ForemanRemoteExecution::Engine.paths['db/migrate'].existent
    end

    initializer "foreman_remote_execution.apipie" do
      Apipie.configuration.checksum_path += ['/api/']
    end

    initializer "foreman_remote_execution.require_dynflow", :before => "foreman_tasks.initialize_dynflow" do |app|
      ForemanTasks.dynflow.require!
      ForemanTasks.dynflow.config.eager_load_paths << File.join(ForemanRemoteExecution::Engine.root, 'app/lib/actions')
    end

    initializer 'foreman_remote_execution.register_plugin', after: :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_remote_execution do
        requires_foreman '>= 1.9'

        apipie_documented_controllers ["#{ForemanRemoteExecution::Engine.root}/app/controllers/api/v2/*.rb"]

        # Add permissions
        security_block :foreman_remote_execution do
          permission :view_job_templates, { :job_templates => [:index, :show, :revision, :auto_complete_search, :auto_complete_job_name, :preview],
                                            :'api/v2/job_templates' => [:index, :show, :revision] }, :resource_type => 'JobTemplate'
          permission :create_job_templates, { :job_templates => [:new, :create, :clone_template],
                                              :'api/v2/job_templates' => [:create, :clone] }, :resource_type => 'JobTemplate'
          permission :edit_job_templates, { :job_templates => [:edit, :update],
                                            :'api/v2/job_templates' => [:update] }, :resource_type => 'JobTemplate'
          permission :destroy_job_templates, { :job_templates => [:destroy],
                                               :'api/v2/job_templates' => [:destroy] }, :resource_type => 'JobTemplate'
          permission :lock_job_templates, { :job_templates => [:lock, :unlock] }, :resource_type => 'JobTemplate'

          permission :view_job_invocations, { :job_invocations => [:index, :show, :auto_complete_search] }, :resource_type => 'JobInvocation'

          permission :create_job_invocations, { :job_invocations => [:new, :create, :refresh, :rerun] }, :resource_type => 'JobInvocation'
        end

        # Add a new role called 'ForemanRemoteExecution' if it doesn't exist
        # role 'ForemanRemoteExecution', [:view_foreman_remote_execution]

        # add menu entry
        menu :top_menu, :job_templates,
             url_hash: { controller: :job_templates, action: :index },
             caption: N_('Job templates'),
             parent: :hosts_menu,
             after: :provisioning_templates

        menu :top_menu, :job_invocations,
             url_hash: { controller: :job_invocations, action: :index },
             caption: N_('Jobs'),
             parent: :monitor_menu,
             after: :audits

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
      (Template.descendants + [Template]).each { |klass| klass.send(:include, ForemanRemoteExecution::TemplateRelations) }
      # similarly, attr_accessible :template_inputs_attributes does not work with STI
      (Template.descendants + [Template]).each { |klass| klass.send(:include, ForemanRemoteExecution::TemplateExtensions) }

      (Taxonomy.descendants + [Taxonomy]).each { |klass| klass.send(:include, ForemanRemoteExecution::TaxonomyExtensions) }

      User.send(:include, ForemanRemoteExecution::UserExtensions)
      (Host::Base.descendants + [Host::Base]).each do |klass|
        klass.send(:include, ForemanRemoteExecution::HostExtensions)
        klass.send(:include, ForemanTasks::Concerns::HostActionSubject)
      end
      Bookmark.send(:include, ForemanRemoteExecution::BookmarkExtensions)
      HostsHelper.send(:include, ForemanRemoteExecution::HostsHelperExtensions)

      # We need to explicitly force to load the Task model due to Rails loader
      # having issues with resolving it to Rake::Task otherwise
      require_dependency 'foreman_tasks/task'
      ForemanTasks::Task.send(:include, ForemanRemoteExecution::ForemanTasksTaskExtensions)
    end

    initializer 'foreman_remote_execution.register_gettext', after: :load_config_initializers do |_app|
      locale_dir = File.join(File.expand_path('../../..', __FILE__), 'locale')
      locale_domain = 'foreman_remote_execution'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end
  end
end
