class RenameJobNameToJobCategory < ActiveRecord::Migration[4.2]
  def up
    rename_column :templates, :job_name, :job_category
    rename_column :job_invocations, :job_name, :job_category
    JobTemplate.where(:description_format => '%{job_name} %{command}').update_all(:description_format => 'Run %{command}')
    JobTemplate.where("description_format LIKE '%\%{job_name}%'").find_each do |template|
      JobTemplate.where(:id => template.id).update_all(:description_format => template.description_format.gsub('%{job_name}', '%{job_category}'))
    end
  end

  def down
    JobTemplate.where("description_format LIKE '%\%{job_category}%'").find_each do |template|
      JobTemplate.where(:id => template.id).update_all(:description_format => template.description_format.gsub('%{job_category}', '%{job_name}'))
    end
    JobTemplate.where(:description_format => 'Run %{command}').update_all(:description_format => '%{job_name} %{command}')
    rename_column :templates, :job_category, :job_name
    rename_column :job_invocations, :job_category, :job_name
  end
end
