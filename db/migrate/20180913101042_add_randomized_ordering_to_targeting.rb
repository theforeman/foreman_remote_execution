class AddRandomizedOrderingToTargeting < ActiveRecord::Migration[5.2]
  def change
    add_column :targetings, :randomized_ordering, :bool, :default => false
  end
end
