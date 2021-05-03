class ChangeTargetingSearchQueryType < ActiveRecord::Migration[4.2]
  def change
    change_column :targetings, :search_query, :text
  end
end
