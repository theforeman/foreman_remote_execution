['SSH', 'Ansible'].each do |feature_name|
  proxy_feature = Feature.where(:name => feature_name).first_or_create
  if proxy_feature.nil? || proxy_feature.errors.any?
    raise "Unable to create proxy feature: #{format_errors proxy_feature}"
  end
end
