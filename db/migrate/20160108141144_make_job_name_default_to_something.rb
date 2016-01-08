class MakeJobNameDefaultToSomething < ActiveRecord::Migration
  def up
    change_column :templates, :job_name, :string, :default => 'Miscellaneous'
  end

  def down
    change_column :templates, :job_name, :string, :default => nil
  end
end
