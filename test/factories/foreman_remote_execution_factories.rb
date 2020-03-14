FactoryBot.define do
  factory :job_template do
    sequence(:name) { |n| "Job template #{n}" }
    sequence(:job_category) { |n| "Job name #{n}" }
    template { 'id' }
    provider_type { 'SSH' }
    organizations { [Organization.find_by(name: 'Organization 1')] }
    locations { [Location.find_by(name: 'Location 1')] }

    trait :with_input do
      after(:build) do |template, evaluator|
        template.template_inputs << FactoryBot.build(:template_input)
      end
    end

    trait :with_description_format do
      description_format { 'Factory-built %{job_category}' }
    end

    trait :with_feature do
      remote_execution_feature
    end
  end

  factory :foreign_input_set

  factory :targeting do
    search_query { 'name = foo' }
    targeting_type { 'static_query' }
    user

    trait :with_randomized_ordering do
      randomized_ordering { true }
    end
  end

  factory :job_invocation do |f|
    targeting
    f.sequence(:job_category) { |n| "Job name #{n}" }
    f.description_format { "%{job_category}" }
    trait :with_template do
      after(:build) do |invocation, evaluator|
        invocation.pattern_template_invocations << FactoryBot.build(:template_invocation)
      end
    end

    trait :with_failed_task do
      after(:build) do |invocation, _evaluator|
        invocation.template_invocations << FactoryBot.build(:template_invocation, :with_failed_task, :with_host)
        invocation.task = FactoryBot.build(:some_task)
      end
    end

    trait :with_task do
      after(:build) do |invocation, _evaluator|
        invocation.template_invocations << FactoryBot.build(:template_invocation, :with_task, :with_host)
        invocation.task = FactoryBot.build(:some_task)
      end
    end

    trait :with_unplanned_host do
      after(:build) do |invocation, _evaluator|
        invocation.targeting.hosts << FactoryBot.build(:host)
      end
    end
  end

  factory :remote_execution_provider do |f|
    f.sequence(:name) { |n| "Provider #{n}" }
  end

  factory :template_invocation do
    job_invocation
    association :template, :factory => :job_template

    trait :with_task do
      after(:build) do |template, _evaluator|
        template.run_host_job_task = FactoryBot.build(:some_task)
      end
    end

    trait :with_failed_task do
      after(:build) do |template, _evaluator|
        template.run_host_job_task = FactoryBot.build(:some_task, :result => 'error')
      end
    end

    trait :with_host do
      after(:build) do |template, _evaluator|
        template.host = FactoryBot.build(:host)
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

FactoryBot.modify do
  factory :feature do
    trait :ssh do
      name { 'SSH' }
    end
  end

  factory :smart_proxy do
    trait :ssh do
      features { [FactoryBot.create(:feature, :ssh)] }
      pubkey { 'ssh-rsa AAAAB3N...' }
    end
  end

  factory :subnet do
    trait :execution do
      remote_execution_proxies { [FactoryBot.build(:smart_proxy, :ssh)] }
    end
  end

  factory :host do
    trait :with_execution do
      managed
      domain
      subnet do
        overrides = {
          :remote_execution_proxies => [FactoryBot.create(:smart_proxy, :ssh)],
        }

        overrides[:locations] = [location] unless location.nil?
        overrides[:organizations] = [organization] unless organization.nil?

        FactoryBot.create(
          :subnet_ipv4,
          overrides
        )
      end
      interfaces do
        [FactoryBot.build(:nic_primary_and_provision, :ip => subnet.network.sub(/0\Z/, '1'), :execution => true)]
      end
    end
  end
end
