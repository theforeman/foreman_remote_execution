Rails.application.routes.draw do
  resources :job_templates, :except => [:show] do
    member do
      get 'clone_template'
      get 'lock'
      get 'export'
      get 'unlock'
      post 'preview'
    end
    collection do
      post 'preview'
      post 'import'
      get 'revision'
      get 'auto_complete_search'
      get 'auto_complete_job_category'
    end
  end

  match 'job_invocations/new', to: 'react#index', :via => [:get], as: 'new_job_invocation'
  match 'job_invocations/new', to: 'job_invocations#create', via: [:post], as: 'create_job_invocation'
  match 'job_invocations/', to: 'job_invocations#legacy_create', via: [:post], as: 'legacy_create_job_invocation'
  match 'job_invocations/:id/rerun', to: 'react#index', :via => [:get], as: 'rerun_job_invocation'
  match 'old/job_invocations/new', to: 'job_invocations#new', via: [:get], as: 'form_new_job_invocation'
  match 'old/job_invocations/:id/rerun', to: 'job_invocations#rerun', via: [:get, :post], as: 'form_rerun_job_invocation'
  match 'experimental/job_invocations_detail/:id', to: 'react#index', :via => [:get], as: 'new_job_invocation_detail'

  resources :job_invocations, :only => [:create, :show, :index] do
    collection do
      get 'preview_job_invocations_per_host'
      post 'refresh'
      get 'chart'
      get 'preview_hosts'
      get 'auto_complete_search'
    end
    member do
      post 'cancel'
    end
  end

  resources :remote_execution_features, :only => [:show, :index, :update]

  # index is needed so the auto_complete_search can be constructed, otherwise autocompletion in filter does not work
  resources :template_invocations, :only => [:show, :index] do
    collection do
      get 'auto_complete_search'
    end
  end

  constraints(:id => %r{[^/]+}) do
    get 'cockpit/host_ssh_params/:id', to: 'cockpit#host_ssh_params'
  end
  get 'cockpit/redirect', to: 'cockpit#redirect'
  get 'ui_job_wizard/categories', to: 'ui_job_wizard#categories'
  get 'ui_job_wizard/template/:id', to: 'ui_job_wizard#template'
  get 'ui_job_wizard/resources', to: 'ui_job_wizard#resources'
  get 'ui_job_wizard/job_invocation', to: 'ui_job_wizard#job_invocation'

  namespace :api, :defaults => {:format => 'json'} do
    scope '(:apiv)', :module => :v2, :defaults => {:apiv => 'v2'}, :apiv => /v1|v2/, :constraints => ApiConstraints.new(:version => 2, :default => true) do
      resources :job_invocations, :except => [:new, :edit, :update, :destroy] do
        resources :hosts, :only => :none do
          get '/', :to => 'job_invocations#output'
          get '/raw', :to => 'job_invocations#raw_output'
        end
        member do
          get 'hosts'
          post 'cancel'
          post 'rerun'
          get  'template_invocations', :to => 'template_invocations#template_invocations'
          get 'outputs'
          post 'outputs'
        end
      end

      resources :job_templates, :except => [:new, :edit] do
        resources :locations, :only => [:index, :show]
        resources :organizations, :only => [:index, :show]
        get :export, :on => :member
        post :clone, :on => :member
        collection do
          get 'revision'
          post 'import'
        end
      end

      resources :organizations, :only => [:index] do
        resources :job_templates, :only => [:index, :show]
      end

      resources :locations, :only => [:index] do
        resources :job_templates, :only => [:index, :show]
      end

      resources :templates, :only => :none do
        resources :foreign_input_sets, :only => [:index, :show, :create, :destroy, :update]
      end

      get 'hosts/:id/available_remote_execution_features', to: 'remote_execution_features#available_remote_execution_features'

      resources :remote_execution_features, :only => [:show, :index, :update]
    end
  end
end
