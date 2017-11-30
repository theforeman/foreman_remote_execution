class MakeJobNameDefaultToSomething < ActiveRecord::Migration[4.2]
  def up
    change_column :templates, :job_name, :string, :default => 'Miscellaneous', :limit => 255
  end

  def down
    change_column :templates, :job_name, :string, :default => nil, :limit => 255
  end
end
