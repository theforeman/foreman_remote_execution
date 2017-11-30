class AddResolvedAtToTargeting < ActiveRecord::Migration[4.2]
  def change
    add_column :targetings, :resolved_at, :datetime
  end
end
