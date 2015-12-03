class JobInvocationComposer

  class UiParams
    attr_reader :ui_params
    def initialize(ui_params)
      @ui_params = ui_params
    end

    def params
      { :job_name => job_invocation_base[:job_name],
        :targeting => ui_params.fetch(:targeting, {}).merge(:user_id => User.current.id),
        :triggering => job_invocation_base.fetch(:triggering, {}),
        :host_ids => ui_params[:host_ids],
        :description_format => job_invocation_base[:description_format],
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    def job_invocation_base
      ui_params.fetch(:job_invocation, {})
    end

    def providers_base
      job_invocation_base.fetch(:providers, {})
    end

    # parses params to get job templates in form of id => attributes for selected job templates, e.g.
    # {
    #   "459" => {},
    #   "454" => {
    #     "input_values" => {
    #       "2" => {
    #         "value" => ""
    #       },
    #       "5" => {
    #         "value" => ""
    #       }
    #     }
    #   }
    # }
    def template_invocations_params
      providers_base.values.map do |template_params|
        template_base = (template_params.fetch(:job_templates, {}).fetch(template_params[:job_template_id], {})).dup.with_indifferent_access
        template_base[:template_id] = template_params[:job_template_id]
        input_values_params = template_base.fetch(:input_values, {})
        template_base[:input_values] = input_values_params.map do |id, values|
          values.merge(:template_input_id => id)
        end

        template_base
      end
    end
  end

  class ApiParams
    attr_reader :api_params

    def initialize(api_params)
      @api_params = api_params
    end

    def params
      { :job_name => job_name,
        :targeting => targeting_params,
        :triggering => {},
        :description_format => api_params[:description_format] || template_with_default.generate_description_format,
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    def job_name
      api_params[:job_name]
    end

    def targeting_params
      raise ::Foreman::Exception, _('Cannot specify both bookmark_id and search_query') if api_params[:bookmark_id] && api_params[:search_query]
      api_params.slice(:targeting_type, :bookmark_id, :search_query).merge(:user_id => User.current.id)
    end

    def template_invocations_params
      template = template_with_default
      template_invocation_params = { :template_id => template.id, :effective_user => api_params[:effective_user] }
      template_invocation_params[:input_values] = api_params.fetch(:inputs, {}).map do |name, value|
        input = template.template_inputs.find_by_name(name)
        unless input
          raise ::Foreman::Exception, _('Unknown input %{input_name} for template %{template_name}') %
              { :input_name => name, :template_name => template.name }
        end
        { :template_input_id => input.id, :value => value }
      end
      [template_invocation_params]
    end

    def template_with_default
      template = nil
      templates = JobTemplate.authorized(:view_job_templates).where(:job_name => job_name)
      template = templates.find(api_params[:job_template_id]) if api_params[:job_template_id]
      template ||= templates.first if templates.count == 1
      raise ::Foreman::Exception, _('Cannot determine the template to be used of job %s') % job_name unless template
      return template
    end

  end

  class ParamsFromJobInvocation
    attr_reader :job_invocation

    def initialize(job_invocation)
      @job_invocation = job_invocation
    end

    def params
      { :job_name => job_invocation.job_name,
        :targeting => targeting_params,
        :triggering => triggering_params,
        :description_format => job_invocation.description_format,
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    private


    def targeting_params
      job_invocation.targeting.attributes.slice('search_query', 'bookmark_id', 'user_id', 'targeting_type')
    end

    def template_invocations_params
      job_invocation.template_invocations.map do |template_invocation|
        params = template_invocation.attributes.slice('template_id', 'effective_user')
        params['input_values'] = template_invocation.input_values.map { |v| v.attributes.slice('template_input_id', 'value') }
        params
      end
    end

    def triggering_params
      ForemanTasks::Triggering.new_from_params.attributes.slice("mode", "start_at", "start_before")
    end
  end

  attr_accessor :params, :job_invocation, :host_ids, :search_query
  delegate :job_name, :template_invocations, :targeting, :triggering, :to => :job_invocation

  def initialize(params, set_defaults = false)
    @params = params
    @set_defaults = set_defaults
    @job_invocation = JobInvocation.new
    @job_invocation.task_group = JobInvocationTaskGroup.new
    compose

    @host_ids = validate_host_ids(params[:host_ids])
    @search_query = job_invocation.targeting.search_query unless job_invocation.targeting.bookmark_id.present?
  end

  def self.from_job_invocation(job_invocation)
    self.new(ParamsFromJobInvocation.new(job_invocation).params)
  end

  def self.from_ui_params(ui_params)
    self.new(UiParams.new(ui_params).params, true)
  end

  def self.from_api_params(api_params)
    self.new(ApiParams.new(api_params).params)
  end

  def compose
    job_invocation.job_name = validate_job_name(params[:job_name])
    job_invocation.job_name ||= available_job_names.first if @set_defaults
    job_invocation.targeting = build_targeting
    job_invocation.triggering = build_triggering
    job_invocation.template_invocations = build_template_invocations
    job_invocation.description_format = params[:description_format]

    self
  end

  def valid?
    targeting.valid? & job_invocation.valid? & !template_invocations.map(&:valid?).include?(false)
  end

  def save
    valid? && job_invocation.save
  end

  def save!
    if valid?
      job_invocation.save!
    else
      raise job_invocation.flattened_validation_exception
    end
  end

  def available_templates
    JobTemplate.authorized(:view_job_templates)
  end

  def available_templates_for(job_name)
    available_templates.where(:job_name => job_name)
  end

  def available_job_names
    available_templates.reorder(:job_name).group(:job_name).pluck(:job_name)
  end

  def available_provider_types
    available_templates_for(job_name).reorder(:provider_type).group(:provider_type).pluck(:provider_type)
  end

  def available_template_inputs
    TemplateInput.where(:template_id => job_template_ids.empty? ? available_templates_for(job_name).map(&:id) : job_template_ids)
  end

  def needs_provider_type_selection?
    available_provider_types.size > 1
  end

  def only_one_template_available?
    !needs_provider_type_selection? && templates_for_provider(available_provider_types.first).size == 1
  end

  def displayed_provider_types
    # TODO available_provider_types based on targets
    available_provider_types
  end

  def templates_for_provider(provider_type)
    available_templates_for(job_name).select { |t| t.provider_type == provider_type }
  end

  def selected_job_templates
    available_templates_for(job_name).where(:id => job_template_ids)
  end

  def preselect_disabled_for_provider(provider_type)
    (templates_for_provider(provider_type) & selected_job_templates).empty?
  end

  def displayed_search_query
    if @search_query.present?
      @search_query
    elsif host_ids.present?
      targeting.build_query_from_hosts(host_ids)
    elsif targeting.bookmark_id
      if (bookmark = available_bookmarks.where(:id => targeting.bookmark_id).first)
        bookmark.query
      else
        ''
      end
    else
      ''
    end
  end

  def available_bookmarks
    Bookmark.authorized(:view_bookmarks).my_bookmarks.where(:controller => ['hosts', 'dashboard'])
  end

  def targeted_hosts
    if displayed_search_query.blank?
      Host.where('1 = 0')
    else
      Host.authorized(Targeting::RESOLVE_PERMISSION, Host).search_for(displayed_search_query)
    end
  end

  def targeted_hosts_count
    targeted_hosts.count
  rescue
    0
  end

  def template_invocation(job_template)
    template_invocations.find { |invocation| invocation.template == job_template }
  end

  def template_invocation_input_value_for(input)
    invocations = template_invocations
    default = TemplateInvocationInputValue.new
    if (invocation = invocations.detect { |i| i.template_id == input.template_id })
      invocation.input_values.detect { |iv| iv.template_input_id == input.id } || default
    else
      default
    end
  end

  def job_template_ids
    job_invocation.template_invocations.map(&:template_id)
  end

  private

  def dup_template_invocations(job_invocation)
    job_invocation.template_invocations.map do |template_invocation|
      duplicate = template_invocation.dup
      template_invocation.input_values.map { |value| duplicate.input_values.build :value => value.value, :template_input_id => value.template_input_id }
      duplicate.effective_user = template_invocation.effective_user
      duplicate
    end
  end

  # builds input values for a given templates id based on params
  # omits inputs that belongs to unavailable templates
  def build_input_values_for(job_template_base)
    job_template_base.fetch('input_values', {}).map do |attributes|
      input = available_template_inputs.find_by_id(attributes[:template_input_id])
      input ? input.template_invocation_input_values.build(attributes) : nil
    end.compact
  end

  def build_targeting
    # if bookmark was used we compare it to search query,
    # when it's the same, we delete the query since it is used from bookmark
    # when no bookmark is set we store the query
    bookmark_id = params[:targeting][:bookmark_id]
    bookmark = available_bookmarks.where(:id => bookmark_id).first
    query = params[:targeting][:search_query]
    if bookmark.present? && query.present?
      if query.strip == bookmark.query.strip
        query = nil
      else
        bookmark_id = nil
      end
    elsif query.present?
      query = params[:targeting][:search_query]
      bookmark_id = nil
    end

    Targeting.new(
        :bookmark_id => bookmark_id,
        :targeting_type => params[:targeting][:targeting_type],
        :search_query => query
    ) { |t| t.user_id =  params[:targeting][:user_id] }
  end

  def build_triggering
    ::ForemanTasks::Triggering.new_from_params(params[:triggering])
  end

  def build_template_invocations
    valid_template_ids = validate_job_template_ids(params[:template_invocations].map { |t| t[:template_id] })

    params[:template_invocations].select { |t| valid_template_ids.include?(t[:template_id].to_i) }.map do |template_invocation_params|
      template_invocation = job_invocation.template_invocations.build(:template_id => template_invocation_params[:template_id],
                                                                      :effective_user => build_effective_user(template_invocation_params))
      template_invocation.input_values = build_input_values_for(template_invocation_params)
      template_invocation
    end
  end

  def build_effective_user(template_invocation_params)
    job_template = available_templates.find(template_invocation_params[:template_id])
    if job_template.effective_user.overridable? && template_invocation_params[:effective_user].present?
      template_invocation_params[:effective_user]
    else
      job_template.effective_user.compute_value
    end
  end

  # returns nil if user can't see any job template with such name
  # existing job_name string otherwise
  def validate_job_name(name)
    available_job_names.include?(name) ? name : nil
  end

  def validate_job_template_ids(ids)
    available_templates_for(job_name).where(:id => ids).pluck(:id)
  end

  def validate_host_ids(ids)
    Host.authorized(Targeting::RESOLVE_PERMISSION, Host).where(:id => ids).pluck(:id)
  end
end
