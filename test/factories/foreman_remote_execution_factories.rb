FactoryGirl.define do

  factory :job_template do |f|
    f.sequence(:name) { |n| "Job template #{n}" }
    sequence(:job_category) { |n| "job name #{n}" }
    f.template 'id'
    f.provider_type 'SSH'
    organizations { [Organization.find_by(name: 'Organization 1')] } if SETTINGS[:organizations_enabled]
    locations { [Location.find_by(name: 'Location 1')] } if SETTINGS[:locations_enabled]


    trait :with_input do
      after(:build) do |template, evaluator|
        template.template_inputs << FactoryGirl.build(:template_input)
      end
    end

    trait :with_description_format do
      description_format 'Factory-built %{job_category}'
    end

    trait :with_feature do
      remote_execution_feature
    end
  end

  factory :template_input do |f|
    f.sequence(:name) { |n| "Template input #{n}" }
    f.input_type 'user'
  end

  factory :foreign_input_set

  factory :targeting do |f|
    search_query 'name = foo'
    targeting_type 'static_query'
    user
  end

  factory :job_invocation do |f|
    targeting
    f.sequence(:job_category) { |n| "Job name #{n}" }
    f.description_format '%{job_category}'
    trait :with_template do
      after(:build) do |invocation, evaluator|
        invocation.pattern_template_invocations << FactoryGirl.build(:template_invocation)
      end

    end

    trait :with_task do
      after(:build) do |invocation, _evaluator|
        invocation.template_invocations << FactoryGirl.build(:template_invocation, :with_task, :with_host)
        invocation.task = FactoryGirl.build(:some_task)
      end
    end
  end

  factory :remote_execution_provider do |f|
    f.sequence(:name) { |n| "Provider #{n}" }
  end

  factory :template_invocation do |f|
    job_invocation
    association :template, :factory => :job_template

    trait :with_task do
      after(:build) do |template, _evaluator|
        template.run_host_job_task = FactoryGirl.build(:some_task)
      end
    end

    trait :with_failed_task do
      after(:build) do |template, _evaluator|
        template.run_host_job_task = FactoryGirl.build(:some_task, :result => 'error')
      end
    end

    trait :with_host do
      after(:build) do |template, _evaluator|
        template.host = FactoryGirl.build(:host)
      end
    end
  end

  factory :template_invocation_input_value do |f|
    f.sequence(:value) { |n| "Input Value #{n}" }
  end

  factory :remote_execution_feature do |f|
    f.sequence(:label) { |n| "remote_execution_feature_#{n}" }
    f.sequence(:name) { |n| "Remote Execution Feature #{n}" }
  end
end

FactoryGirl.modify do
  factory :feature do
    trait :ssh do
      name 'SSH'
    end
  end

  factory :smart_proxy do
    trait :ssh do
      features { [FactoryGirl.build(:feature, :ssh)] }
      pubkey 'ssh-rsa AAAAB3N...'
    end
  end

  factory :subnet do
    trait :execution do
      remote_execution_proxies { [FactoryGirl.build(:smart_proxy, :ssh)] }
    end
  end

  factory :host do
    trait :with_execution do
      managed
      domain
      subnet do
        overrides = {
          :remote_execution_proxies => [FactoryGirl.create(:smart_proxy, :ssh)]
        }

        overrides[:locations] = [location] unless location.nil?
        overrides[:organizations] = [organization] unless organization.nil?

        FactoryGirl.create(
          :subnet_ipv4,
          overrides
        )
      end
      interfaces do
        [FactoryGirl.build(:nic_primary_and_provision, :ip => subnet.network.sub(/0\Z/, '1'), :execution => true)]
      end
    end
  end
end
