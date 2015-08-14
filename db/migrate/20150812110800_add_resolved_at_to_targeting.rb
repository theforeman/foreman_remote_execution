class AddResolvedAtToTargeting < ActiveRecord::Migration
  def change
    add_column :targetings, :resolved_at, :datetime
  end
end
