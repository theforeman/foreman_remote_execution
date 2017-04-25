class RenameJobCategories < ActiveRecord::Migration
  MAP = {
    'Package Action - SSH Default' => ['Package Action', 'Packages'],
    'Puppet Run Once - SSH Default' => ['Puppet Run Once', 'Puppet'],
    'Run Command - SSH Default' => ['Run Command', 'Commands'],
    'Service Action - SSH Default' => ['Service Action', 'Services'],
  }.freeze

  def up
    MAP.each do |name, transition|
      JobTemplate.where(:name => name).update_all(:job_name => transition.last)
    end
  end

  def down
    MAP.each do |name, transition|
      JobTemplate.where(:name => name).update_all(:job_name => transition.first)
    end
  end
end
