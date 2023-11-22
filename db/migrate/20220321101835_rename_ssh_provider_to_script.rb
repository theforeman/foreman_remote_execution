# frozen_string_literal: true

class RenameSshProviderToScript < ActiveRecord::Migration[6.0]

  def do_change(from, to, from_re, new_label)
    setting = Setting.find_by(:name => 'remote_execution_form_job_template')
    default_template = nil

    Template.where(:provider_type => from).find_each do |t|
      default_template = t if t.name == setting&.value
      t.provider_type = to
      t.name = t.name.gsub(from_re, new_label)
      t.save!
    end

    if default_template
      setting.value = default_template.name
      setting.save!
    end
  end

  def up
    do_change 'SSH', 'script', /SSH Default$/, 'Script Default'
  end

  def down
    do_change 'script', 'SSH', /Script Default$/, 'SSH Default'
  end
end
