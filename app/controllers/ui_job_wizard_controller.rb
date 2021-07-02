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
    job_template = JobTemplate.authorized.find(params[:id])
    advanced_template_inputs, template_inputs = map_template_inputs(job_template.template_inputs_with_foreign).partition { |x| x["advanced"] }
    render :json => {
      :job_template => job_template,
      :effective_user => job_template.effective_user,
      :template_inputs => template_inputs,
      :advanced_template_inputs => advanced_template_inputs,
    }
  end

  def resource_name(nested_resource = nil)
    nested_resource || 'job_template'
  end

  def map_template_inputs(template_inputs_with_foreign)
    template_inputs_with_foreign.map { |input| input.attributes.merge({:resource_type => input.resource_type&.tableize }) }
  end

  def resource_class
    JobTemplate
  end

  def action_permission
    :view_job_templates
  end
end
