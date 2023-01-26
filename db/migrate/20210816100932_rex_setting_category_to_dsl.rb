class RexSettingCategoryToDsl < ActiveRecord::Migration[6.0]
  def up
    Setting.where(category: 'Setting::RemoteExecution').update_all(category: 'Setting') if column_exists?(:settings, :category)
  end
end
