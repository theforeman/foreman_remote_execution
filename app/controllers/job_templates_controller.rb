class JobTemplatesController < ::TemplatesController
  def load_vars_from_template
    return unless @template

    @locations        = @template.locations
    @organizations    = @template.organizations
  end

  def auto_complete_job_name
    @job_names = resource_base.where(['job_name LIKE ?', "%#{params[:search]}%"]).pluck(:job_name)
  end

  private

  def action_permission
    case params[:action]
      when 'auto_complete_job_name'
        :view_job_templates
      else
        super
    end
  end
end
