FactoryGirl.define do
  factory :job_template do |f|
    f.sequence(:name) { |n| "Job template #{n}" }
    f.template 'id'
    f.provider_type 'ssh'
  end

  factory :template_input do |f|
    f.sequence(:name) { |n| "Template input #{n}" }
    f.input_type TemplateInput::TYPES.keys.first
  end
end
