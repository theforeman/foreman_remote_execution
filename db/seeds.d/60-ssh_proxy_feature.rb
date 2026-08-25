f = Feature.where(:name => 'SSH').first_or_create
raise "Unable to create proxy feature: #{SeedHelper.format_errors(f)}" if f.nil? || f.errors.any?

f = Feature.where(:name => 'Script').first_or_create
raise "Unable to create proxy feature: #{SeedHelper.format_errors(f)}" if f.nil? || f.errors.any?
