# This class is a shim to handle the importing of templates via the
# foreman_templates plugin. It expects a method like
#     def import(name, text, metadata)
# but REx already has an import! method, so this class provides the
# translation layer.

class JobTemplateImporter
  def self.import!(name, text, metadata, force = false)
    skip = skip_locked(name, force)
    return skip if skip

    template = JobTemplate.import_parsed(name, text, metadata, :update => true, :force => force)
    c_or_u = template.new_record? ? 'Created' : 'Updated'

    result = "  #{c_or_u} Template #{id_string template}:#{name}"
    { :old => template.template_was,
      :new => template.template,
      :status => template.save,
      :result => result}
  end

  def self.skip_locked(name, force)
    template = JobTemplate.find_by :name => name

    if template && template.locked? && !template.new_record? && !force
      { :old => template.template_was,
        :new => template.template,
        :status => false,
        :result => "Skipping Template #{id_string template}:#{name} - template is locked" }
    end
  end

  def self.id_string(template)
    template ? template.id.to_s : ''
  end
end
