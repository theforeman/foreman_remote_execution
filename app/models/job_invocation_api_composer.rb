class JobInvocationApiComposer
  attr_accessor :params, :job_invocation, :host_ids, :search_query

  delegate :job_name, :to => :job_invocation
  delegate :targeting, :to => :job_invocation
  delegate :template_invocations, :to => :job_invocation

  def initialize(job_invocation, user, params)
    @job_invocation = job_invocation
    @params = params

    self.job_invocation.job_name = params[:job_name] if params[:job_name]
    self.job_invocation.targeting = build_targeting(user)
    self.job_invocation.template_invocations = [build_template_invocation]
  end

  def build_targeting(user)
    raise ::Foreman::Exception, _('Cannot specify both bookmark_id and search_query') if params[:bookmark_id] && params[:search_query]
    targeting ||= job_invocation.targeting || job_invocation.build_targeting
    targeting.targeting_type = params[:targeting_type] if params[:targeting_type]
    targeting.bookmark = available_bookmarks.find(params[:bookmark_id]) if params[:bookmark_id]
    targeting.search_query = params[:search_query]
    targeting.user = user
    targeting
  end

  def build_template_invocation
    invocation = TemplateInvocation.new
    invocation.template = find_job_template
    build_input_values(invocation) if invocation.template
    invocation
  end

  def find_job_template
    templates = JobTemplate.authorized(:view_job_templates).where(:job_name => job_name)
    template = templates.find(params[:template_id]) if params[:template_id]
    template = templates.first if templates.count == 1
    template
  end

  def build_input_values(invocation)
    input_values = params.fetch(:inputs, []).map do |input_hash|
      if (input = template_input(invocation.template, input_hash[:name]))
        invocation.input_values.build(:template_input => input, :value => input_hash[:value])
      end
    end
    input_values.compact
  end

  def template_input(template, name)
    template.template_inputs.find_by_name(name)
  end

  def valid?
    targeting.valid? & job_invocation.valid? & template_invocations.all?(&:valid?)
  end

  def save!
    if valid?
      job_invocation.save!
    else
      raise job_invocation.flattened_validation_exception
    end
  end

  def available_bookmarks
    Bookmark.authorized(:view_bookmarks).my_bookmarks
  end
end
