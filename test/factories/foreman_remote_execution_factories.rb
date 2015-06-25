FactoryGirl.define do
  factory :job_template do |f|
    f.sequence(:name) { |n| "Job template #{n}" }
    f.template 'id'
    f.provider_type 'ssh'

    trait :with_input do
      after(:build) do |template, evaluator|
        template.template_inputs << FactoryGirl.build(:template_input)
      end
    end
  end

  factory :template_input do |f|
    f.sequence(:name) { |n| "Template input #{n}" }
    f.input_type TemplateInput::TYPES.keys.first
  end

  factory :targeting do |f|
    search_query "name = foo"
    targeting_type "static_query"
    user
  end

  factory :job_invocation do |f|
    targeting
    f.sequence(:job_name) { |n| "Job name #{n}" }
    trait :with_template do
      after(:build) do |invocation, evaluator|
        invocation.template_invocations << FactoryGirl.build(:template_invocation)
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
