class JobTemplatesController < ::TemplatesController
  include ::Foreman::Controller::Parameters::JobTemplate

  def load_vars_from_template
    return unless @template

    @locations        = @template.locations
    @organizations    = @template.organizations
  end

  def auto_complete_job_category
    @job_categories = resource_base.where(['job_category LIKE ?', "%#{params[:search]}%"]).pluck(:job_category).uniq
    render :json => @job_categories.map { |name| { 'completed' => '', 'part' => name, 'label' => name, 'category' => '' } }.to_json
  end

  def preview
    find_resource unless @template.present?
    base = Host.authorized(:view_hosts, Host)
    host = params[:preview_host_id].present? ? base.find(params[:preview_host_id]) : base.first
    @template.template = params[:template]
    renderer = InputTemplateRenderer.new(@template, host)
    if (output = renderer.preview)
      render :text => output
    else
      render :status => 406, :text => _('Problem with previewing the template: %{error}. Note that you must save template input changes before you try to preview it.' % {:error => renderer.error_message})
    end
  end

  def import
    contents = params.fetch(:imported_template, {}).fetch(:template, nil).try(:read)

    @template = JobTemplate.import(contents, :update => Foreman::Cast.to_bool(params[:imported_template][:overwrite]))
    if @template && @template.save
      flash[:notice] = _('Job template imported successfully.')
      redirect_to job_templates_path(:search => "name = \"#{@template.name}\"")
    else
      @template ||= JobTemplate.import(contents, :build_new => true)
      @template.valid?
      flash[:warning] = _('Unable to save template. Correct highlighted errors')
      render :action => 'new'
    end
  end

  def export
    find_resource unless @template.present?
    send_data @template.to_erb, :type => 'text/plain', :disposition => 'attachment', :filename => @template.filename
  end

  private

  def find_resource
    if params[:id]
      super
    else
      @template = resource_class.new(params[type_name_plural])
    end
  end

  def action_permission
    case params[:action]
      when 'auto_complete_job_category', 'export'
        :view_job_templates
      else
        super
    end
  end
end
