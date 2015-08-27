class ChangeTargetingSearchQueryType < ActiveRecord::Migration
  def change
    change_column :targetings, :search_query, :text
  end
end
