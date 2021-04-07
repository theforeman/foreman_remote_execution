class UiJobWizardController < ::Api::V2::BaseController
  def categories
    job_categories = resource_scope
                     .search_for("job_category ~ \"#{params[:search]}\"")
                     .select(:job_category).distinct
                     .reorder(:job_category)
                     .pluck(:job_category)
    render :json => {:job_categories =>job_categories}
  end

  def template
    job_template = JobTemplate.find_by(id: params[:id])
    render :json => {
      :job_template => job_template,
      :effective_user => job_template.effective_user,
    }
  end

  def resource_class
    JobTemplate
  end

  def action_permission
    :view_job_templates
  end
end
