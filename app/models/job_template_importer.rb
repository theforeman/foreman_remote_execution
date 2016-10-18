# This class is a shim to handle the importing of templates via the
# foreman_templates plugin. It expects a method like
#     def import(name, text, metadata)
# but REx already has an import! method, so this class provides the
# translation layer.

class JobTemplateImporter
  def self.import!(name, text, _metadata)
    template = JobTemplate.import(
      text.sub(/^name: .*$/, "name: #{name}").sub(/^model: .*$/, ''),
      :update => true
    )

    c_or_u = template.new_record? ? 'Created' : 'Updated'
    id_string = ('id' + template.id) rescue ''

    result = "  #{c_or_u} Template #{id_string}:#{name}"
    { :old => template.template_was,
      :new => template.template,
      :status => template.save,
      :result => result
    }
  end
end
