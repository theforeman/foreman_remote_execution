FactoryGirl.define do

  factory :job_template do |f|
    f.sequence(:name) { |n| "Job template #{n}" }
    sequence(:job_category) { |n| "job name #{n}" }
    f.template 'id'
    f.provider_type 'SSH'

    trait :with_input do
      after(:build) do |template, evaluator|
        template.template_inputs << FactoryGirl.build(:template_input)
      end
    end

    trait :with_description_format do
      description_format 'Factory-built %{job_category}'
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
  end

  factory :remote_execution_provider do |f|
    f.sequence(:name) { |n| "Provider #{n}" }
  end

  factory :template_invocation do |f|
    job_invocation
    association :template, :factory => :job_template
  end

  factory :template_invocation_input_value do |f|
    f.sequence(:value) { |n| "Input Value #{n}" }
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
