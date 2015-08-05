class JobTemplatesController < ::TemplatesController
  def load_vars_from_template
    return unless @template

    @locations        = @template.locations
    @organizations    = @template.organizations
  end

  def auto_complete_job_name
    @job_names = resource_base.where(['job_name LIKE ?', "%#{params[:search]}%"]).pluck(:job_name).uniq
  end

  def preview
    base = Host.authorized(:view_hosts)
    host = params[:preview_host_id].present? ? base.find(params[:preview_host_id]) : base.first
    @template.template = params[:template]
    renderer = InputTemplateRenderer.new(@template, host)
    if (output = renderer.preview)
      render :text => output
    else
      render :status => 406, :text => renderer.error_message
    end
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
