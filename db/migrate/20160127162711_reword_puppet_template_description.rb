class RewordPuppetTemplateDescription < ActiveRecord::Migration
  def up
    JobTemplate.where(:name => 'Puppet Run Once - SSH Default').update_all(:description_format => 'Run Puppet once with "%{puppet_options}"')
  end

  def down
    JobTemplate.where(:name => 'Puppet Run Once - SSH Default').update_all(:description_format => '%{job_category} with "%{puppet_options}"')
  end
end
