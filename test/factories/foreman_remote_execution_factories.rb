FactoryGirl.define do
  factory :template_input do |f|
    f.sequence(:name) { |n| "Template input #{n}" }
    f.input_type 'user'
  end

  factory :job_template do
    sequence(:name) { |n| "template#{n}" }
    template 'This is a remote execution job'
    provider_type 'ssh'
  end
end
