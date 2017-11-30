class UpcaseSshFeature < ActiveRecord::Migration[4.2]
  class FakeFeature < ActiveRecord::Base
    self.table_name = 'features'
  end

  def up
    f = FakeFeature.where(:name => 'Ssh').first
    f.update_attribute :name, 'SSH' if f.present?

    JobTemplate.where(:provider_type => 'Ssh').update_all("provider_type = 'SSH'")
  end

  def down
    f = FakeFeature.where(:name => 'SSH').first
    f.update_attribute :name, 'Ssh' if f.present?

    JobTemplate.where(:provider_type => 'SSH').update_all("provider_type = 'Ssh'")
  end
end
