class TargetingAddTaxonomies < ActiveRecord::Migration[5.2]
  def up
    add_column(:targetings, :organization_id, :integer)
    add_column(:targetings, :location_id, :integer)
  end

  def down
    remove_column(:targetings, :organization_id)
    remove_column(:targetings, :location_id)
  end
end
