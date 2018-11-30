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

  resources :job_invocations, :only => [:new, :create, :show, :index] do
    collection do
      post 'refresh'
      get 'chart'
      get 'preview_hosts'
      get 'auto_complete_search'
    end
    member do
      get 'rerun'
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

  namespace :api, :defaults => {:format => 'json'} do
    scope '(:apiv)', :module => :v2, :defaults => {:apiv => 'v2'}, :apiv => /v1|v2/, :constraints => ApiConstraints.new(:version => 2, :default => true) do
      resources :job_invocations, :except => [:new, :edit, :update, :destroy] do
        resources :hosts, :only => :none do
          get '/', :to => 'job_invocations#output'
          get '/raw', :to => 'job_invocations#raw_output'
        end
        member do
          post 'cancel'
          post 'rerun'
          get  'template_invocations', :to => 'template_invocations#template_invocations'
        end
      end

      resources :job_templates, :except => [:new, :edit] do
        (resources :locations, :only => [:index, :show]) if SETTINGS[:locations_enabled]
        (resources :organizations, :only => [:index, :show]) if SETTINGS[:organizations_enabled]
        get :export, :on => :member
        post :clone, :on => :member
        collection do
          get 'revision'
          post 'import'
        end
      end

      if SETTINGS[:organizations_enabled]
        resources :organizations, :only => [:index] do
          resources :job_templates, :only => [:index, :show]
        end
      end

      if SETTINGS[:locations_enabled]
        resources :locations, :only => [:index] do
          resources :job_templates, :only => [:index, :show]
        end
      end

      resources :templates, :only => :none do
        resources :foreign_input_sets, :only => [:index, :show, :create, :destroy, :update]
      end

      resources :remote_execution_features, :only => [:show, :index, :update]
    end
  end
end
