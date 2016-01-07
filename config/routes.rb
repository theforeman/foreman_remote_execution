Rails.application.routes.draw do
  resources :job_templates, :except => [:show] do
    member do
      get 'clone_template'
      get 'lock'
      get 'unlock'
      post 'preview'
    end
    collection do
      post 'preview'
      get 'revision'
      get 'auto_complete_search'
      get 'auto_complete_job_name'
    end
  end

  resources :job_invocations, :only => [:new, :create, :show, :index] do
    collection do
      post 'refresh'
      get 'preview_hosts'
      get 'auto_complete_search'
    end
    member do
      get 'rerun'
    end
  end

  # index is needed so the auto_complete_search can be constructed, otherwise autocompletion in filter does not work
  resources :template_invocations, :only => [:show, :index] do
    collection do
      get 'auto_complete_search'
    end
  end

  namespace :api, :defaults => {:format => 'json'} do
    scope "(:apiv)", :module => :v2, :defaults => {:apiv => 'v2'}, :apiv => /v1|v2/, :constraints => ApiConstraints.new(:version => 2, :default => true) do
      resources :job_invocations, :except => [:new, :edit, :update, :destroy] do
        resources :hosts, :only => :none do
          get '/', :to => 'job_invocations#output'
        end
      end

      resources :job_templates, :except => [:new, :edit] do
        (resources :locations, :only => [:index, :show]) if SETTINGS[:locations_enabled]
        (resources :organizations, :only => [:index, :show]) if SETTINGS[:organizations_enabled]
        post :clone, :on => :member
        collection do
          get 'revision'
        end
      end

      resources :templates, :only => :none do
        resources :template_inputs, :only => [:index, :show, :create, :new, :destroy, :update]
      end
    end
  end
end
