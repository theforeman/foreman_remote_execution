class JobTemplatesController < ::TemplatesController
  def load_vars_from_template
    return unless @template

    @locations        = @template.locations
    @organizations    = @template.organizations
  end
end
