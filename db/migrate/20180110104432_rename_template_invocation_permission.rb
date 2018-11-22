class RenameTemplateInvocationPermission < ActiveRecord::Migration[4.2]
  PERMISSION_NAMES = %w(execute_template_invocation create_template_invocations).freeze

  def up
    switch_filtering_permission!(*PERMISSION_NAMES)
  end

  def down
    switch_filtering_permission!(*PERMISSION_NAMES.reverse)
  end

  private

  def switch_filtering_permission!(old, new)
    old_permission = Permission.find_by(:name => old)
    return if old_permission.nil?
    new_permission = Permission.find_or_create_by(:name => new,
                                                  :resource_type => 'TemplateInvocation')
    old_permission.filterings.each do |filtering|
      filtering.permission_id = new_permission.id
      filtering.save!
    end
    old_permission.destroy!
  end
end
