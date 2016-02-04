class JobInvocationComposer

  class UiParams
    attr_reader :ui_params
    def initialize(ui_params)
      @ui_params = ui_params
    end

    def params
      { :job_category => job_invocation_base[:job_category],
        :targeting => ui_params.fetch(:targeting, {}).merge(:user_id => User.current.id),
        :triggering => ui_params.fetch(:triggering, {}),
        :host_ids => ui_params[:host_ids],
        :description_format => job_invocation_base[:description_format],
        :concurrency_control => concurrency_control_params,
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

    def concurrency_control_params
      {
        :time_span => job_invocation_base[:time_span],
        :level => job_invocation_base[:concurrency_level]
      }
    end
  end

  class ApiParams
    attr_reader :api_params

    def initialize(api_params)
      @api_params = api_params
    end

    def params
      { :job_category => template.job_category,
        :targeting => targeting_params,
        :triggering => triggering_params,
        :description_format => api_params[:description_format],
        :concurrency_control => concurrency_control_params,
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    def targeting_params
      raise ::Foreman::Exception, _('Cannot specify both bookmark_id and search_query') if api_params[:bookmark_id] && api_params[:search_query]
      api_params.slice(:targeting_type, :bookmark_id, :search_query).merge(:user_id => User.current.id)
    end

    def triggering_params
      raise ::Foreman::Exception, _('Cannot specify both recurrence and scheduling') if api_params[:recurrence].present? && api_params[:scheduling].present?

      if api_params[:recurrence].present?
        {
          :mode => :recurring,
          :cronline => api_params[:recurrence][:cron_line],
          :end_time => format_datetime(api_params[:recurrence][:end_time]),
          :input_type => :cronline,
          :max_iteration => api_params[:recurrence][:max_iteration]
        }
      elsif api_params[:scheduling].present?
        {
          :mode => :future,
          :start_at_raw => format_datetime(api_params[:scheduling][:start_at]),
          :start_before_raw => format_datetime(api_params[:scheduling][:start_before]),
          :end_time_limited => api_params[:scheduling][:start_before] ? true : false
        }
      else
        {}
      end
    end

    def concurrency_control_params
      {
        :level => api_params.fetch(:concurrency_control, {})[:concurrency_level],
        :time_span => api_params.fetch(:concurrency_control, {})[:time_span]
      }
    end

    def template_invocations_params
      template_invocation_params = { :template_id => template.id, :effective_user => api_params[:effective_user] }
      template_invocation_params[:input_values] = api_params.fetch(:inputs, {}).map do |name, value|
        input = template.template_inputs_with_foreign.find { |i| i.name == name }
        unless input
          raise ::Foreman::Exception, _('Unknown input %{input_name} for template %{template_name}') %
              { :input_name => name, :template_name => template.name }
        end
        { :template_input_id => input.id, :value => value }
      end
      [template_invocation_params]
    end

    def template
      @template ||= JobTemplate.authorized(:view_job_templates).find(api_params[:job_template_id])
    end

    private

    def format_datetime(datetime)
      return datetime if datetime.blank?
      DateTime.parse(datetime).strftime('%Y-%m-%d %H:%M')
    end
  end

  class ParamsFromJobInvocation
    attr_reader :job_invocation

    def initialize(job_invocation)
      @job_invocation = job_invocation
    end

    def params
      { :job_category => job_invocation.job_category,
        :targeting => targeting_params,
        :triggering => triggering_params,
        :description_format => job_invocation.description_format,
        :concurrency_control => concurrency_control_params,
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    private

    def concurrency_control_params
      {
        :level => job_invocation.concurrency_level,
        :time_span => job_invocation.time_span
      }
    end

    def targeting_params
      job_invocation.targeting.attributes.slice('search_query', 'bookmark_id', 'user_id', 'targeting_type')
    end

    def template_invocations_params
      job_invocation.pattern_template_invocations.map do |template_invocation|
        params = template_invocation.attributes.slice('template_id', 'effective_user')
        params['input_values'] = template_invocation.input_values.map { |v| v.attributes.slice('template_input_id', 'value') }
        params
      end
    end

    def triggering_params
      ForemanTasks::Triggering.new_from_params.attributes.slice('mode', 'start_at', 'start_before')
    end
  end

  class ParamsForFeature
    attr_reader :feature_label, :feature, :provided_inputs

    def initialize(feature_label, hosts, provided_inputs = {})
      @feature = RemoteExecutionFeature.feature(feature_label)
      @provided_inputs = provided_inputs
      if hosts.is_a? Bookmark
        @host_bookmark = hosts
      elsif hosts.is_a? Host::Base
        @host_objects = [hosts]
      elsif hosts.is_a? String
        @host_scoped_search = hosts
      else
        @host_objects = hosts
      end
    end

    def params
      { :job_category => job_template.job_category,
        :targeting => targeting_params,
        :triggering => {},
        :concurrency_control => {},
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    private

    def targeting_params
      ret = {}
      ret['targeting_type'] = Targeting::STATIC_TYPE
      ret['search_query'] = @host_scoped_search if @host_scoped_search
      ret['search_query'] = Targeting.build_query_from_hosts(@host_objects) if @host_objects
      ret['bookmark_id'] = @host_bookmark.id if @host_bookmark
      ret['user_id'] = User.current.id
      ret
    end

    def template_invocations_params
      [ { 'template_id' => job_template.id,
          'input_values' => input_values_params } ]
    end

    def input_values_params
      @provided_inputs.map do |key, value|
        input = job_template.template_inputs_with_foreign.find { |i| i.name == key.to_s }
        unless input
          raise Foreman::Exception.new(N_('Feature input %{input_name} not defined in template %{template_name}'),
                                       :input_name => key, :template_name => job_template.name)
        end
        { 'template_input_id' => input.id, 'value' => value }
      end
    end

    def job_template
      unless feature.job_template
        raise Foreman::Exception.new(N_('No template mapped to feature %{feature_name}'),
                                     :feature_name => feature.name)
      end
      template = JobTemplate.authorized(:view_job_templates).find_by_id(feature.job_template_id)

      unless template
        raise Foreman::Exception.new(N_('The template %{template_name} mapped to feature %{feature_name} is not accessible by the user'),
                                     :template_name => template.name,
                                     :feature_name => feature.name)
      end
      template
    end
  end

  attr_accessor :params, :job_invocation, :host_ids, :search_query
  delegate :job_category, :pattern_template_invocations, :template_invocations, :targeting, :triggering, :to => :job_invocation

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

  def self.for_feature(feature_label, hosts, provided_inputs = {})
    self.new(ParamsForFeature.new(feature_label, hosts, provided_inputs).params)
  end

  def compose
    job_invocation.job_category = validate_job_category(params[:job_category])
    job_invocation.job_category ||= available_job_categories.first if @set_defaults
    job_invocation.targeting = build_targeting
    job_invocation.triggering = build_triggering
    job_invocation.pattern_template_invocations = build_template_invocations
    job_invocation.description_format = params[:description_format]
    job_invocation.time_span = params[:concurrency_control][:time_span].to_i unless params[:concurrency_control][:time_span].blank?
    job_invocation.concurrency_level = params[:concurrency_control][:level].to_i unless params[:concurrency_control][:level].blank?

    self
  end

  def trigger(raise_on_error = false)
    generate_description
    if raise_on_error
      save!
    else
      return false unless save
    end
    triggering.trigger(::Actions::RemoteExecution::RunHostsJob, job_invocation)
  end

  def trigger!
    trigger(true)
  end

  def valid?
    targeting.valid? & job_invocation.valid? & !pattern_template_invocations.map(&:valid?).include?(false)
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
    JobTemplate.authorized(:view_job_templates).where(:snippet => false)
  end

  def available_templates_for(job_category)
    available_templates.where(:job_category => job_category)
  end

  def available_job_categories
    available_templates.reorder(:job_category).group(:job_category).pluck(:job_category)
  end

  def available_provider_types
    available_templates_for(job_category).reorder(:provider_type).group(:provider_type).pluck(:provider_type)
  end

  def available_template_inputs
    TemplateInput.where(:template_id => job_template_ids.empty? ? available_templates_for(job_category).map(&:id) : job_template_ids)
  end

  def needs_provider_type_selection?
    available_provider_types.size > 1
  end

  def displayed_provider_types
    # TODO available_provider_types based on targets
    available_provider_types
  end

  def templates_for_provider(provider_type)
    available_templates_for(job_category).select { |t| t.provider_type == provider_type }
  end

  def selected_job_templates
    available_templates_for(job_category).where(:id => job_template_ids)
  end

  def preselected_template_for_provider(provider_type)
    (templates_for_provider(provider_type) & selected_job_templates).first
  end

  def displayed_search_query
    if @search_query.present?
      @search_query
    elsif host_ids.present?
      Targeting.build_query_from_hosts(host_ids)
    elsif targeting.bookmark_id
      if (bookmark = available_bookmarks.find_by(:id => targeting.bookmark_id))
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
    pattern_template_invocations.find { |invocation| invocation.template == job_template }
  end

  def template_invocation_input_value_for(job_template, input)
    invocations = pattern_template_invocations
    default = TemplateInvocationInputValue.new
    if (invocation = invocations.detect { |i| i.template_id == job_template.id })
      invocation.input_values.detect { |iv| iv.template_input_id == input.id } || default
    else
      default
    end
  end

  def job_template_ids
    job_invocation.pattern_template_invocations.map(&:template_id)
  end

  private

  # builds input values for a given templates id based on params
  # omits inputs that belongs to unavailable templates
  def build_input_values_for(template_invocation, job_template_base)
    template_invocation.input_values = job_template_base.fetch('input_values', {}).map do |attributes|
      input = template_invocation.template.template_inputs_with_foreign.find { |i| i.id.to_s == attributes[:template_input_id].to_s }
      input ? input.template_invocation_input_values.build(attributes) : nil
    end.compact
  end

  def build_targeting
    # if bookmark was used we compare it to search query,
    # when it's the same, we delete the query since it is used from bookmark
    # when no bookmark is set we store the query
    bookmark_id = params[:targeting][:bookmark_id]
    bookmark = available_bookmarks.find_by(:id => bookmark_id)
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
    ) { |t| t.user_id = params[:targeting][:user_id] }
  end

  def build_triggering
    ::ForemanTasks::Triggering.new_from_params(params[:triggering])
  end

  def build_template_invocations
    valid_template_ids = validate_job_template_ids(params[:template_invocations].map { |t| t[:template_id] })

    params[:template_invocations].select { |t| valid_template_ids.include?(t[:template_id].to_i) }.map do |template_invocation_params|
      template_invocation = job_invocation.pattern_template_invocations.build(:template_id => template_invocation_params[:template_id],
                                                                              :effective_user => build_effective_user(template_invocation_params))
      build_input_values_for(template_invocation, template_invocation_params)
      template_invocation
    end
  end

  def generate_description
    unless job_invocation.description_format
      template = job_invocation.pattern_template_invocations.first.try(:template)
      job_invocation.description_format = template.generate_description_format if template
    end
    job_invocation.generate_description! if job_invocation.description.blank?
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
  # existing job_category string otherwise
  def validate_job_category(name)
    available_job_categories.include?(name) ? name : nil
  end

  def validate_job_template_ids(ids)
    available_templates_for(job_category).where(:id => ids).pluck(:id)
  end

  def validate_host_ids(ids)
    Host.authorized(Targeting::RESOLVE_PERMISSION, Host).where(:id => ids).pluck(:id)
  end
end
