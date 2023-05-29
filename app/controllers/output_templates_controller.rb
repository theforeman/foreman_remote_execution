class OutputTemplatesController < ::TemplatesController
  include ::Foreman::Controller::Parameters::OutputTemplate

  def import
    contents = params.fetch(:imported_template, {}).fetch(:template, nil).try(:read)

    @template = OutputTemplate.import_raw(contents, :update => ActiveRecord::Type::Boolean.new.deserialize(params[:imported_template][:overwrite]))
    if @template&.save
      flash[:success] = _('Output template imported successfully.')
      redirect_to output_templates_path(:search => "name = \"#{@template.name}\"")
    else
      @template ||= OutputTemplate.import_raw(contents, :build_new => true)
      @template.valid?
      flash[:warning] = _('Unable to save template. Correct highlighted errors')
      render :action => 'new'
    end
  end
end
