class JobInvocationComposer
  class JobTemplateNotFound < StandardError; end

  class FeatureNotFound < StandardError; end

  class UiParams
    attr_reader :ui_params
    def initialize(ui_params)
      @ui_params = ui_params
    end

    def params
      { :job_category => job_invocation_base[:job_category],
        :targeting => targeting(ui_params.fetch(:targeting, {})),
        :triggering => triggering,
        :host_ids => ui_params[:host_ids],
        :remote_execution_feature_id => job_invocation_base[:remote_execution_feature_id],
        :description_format => job_invocation_base[:description_format],
        :password => blank_to_nil(job_invocation_base[:password]),
        :key_passphrase => blank_to_nil(job_invocation_base[:key_passphrase]),
        :effective_user_password => blank_to_nil(job_invocation_base[:effective_user_password]),
        :concurrency_control => concurrency_control_params,
        :execution_timeout_interval => execution_timeout_interval,
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    def job_invocation_base
      ui_params.fetch(:job_invocation, {})
    end

    def providers_base
      job_invocation_base.fetch(:providers, {})
    end

    def execution_timeout_interval
      providers_base.values.map do |provider|
        id = provider[:job_template_id]
        provider.fetch(:job_templates, {}).fetch(id, {})[:execution_timeout_interval]
      end.first
    end

    def blank_to_nil(thing)
      thing.presence
    end

    # TODO: Fix this comment
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
        template_base = template_params.fetch(:job_templates, {}).fetch(template_params[:job_template_id], {}).dup.with_indifferent_access
        template_base[:template_id] = template_params[:job_template_id]
        input_values_params = template_base.fetch(:input_values, {})
        template_base[:input_values] = input_values_params.map do |id, values|
          values.merge(:template_input_id => id)
        end

        provider_values_params = template_base.fetch(:provider_input_values, {})
        template_base[:provider_input_values] = provider_values_params.map do |key, hash|
          { :name => key, :value => hash[:value] }
        end
        template_base
      end
    end

    def concurrency_control_params
      {
        :time_span => job_invocation_base[:time_span],
        :level => job_invocation_base[:concurrency_level],
      }
    end

    def triggering
      return {} unless ui_params.key?(:triggering)

      trig = ui_params[:triggering]
      keys = (1..5).map { |i| "end_time(#{i}i)" }
      values = trig.fetch(:end_time, {}).values_at(*keys)
      return trig if values.any?(&:nil?)

      trig.merge(:end_time => Time.local(*values))
    end

    def targeting(targeting_params)
      targeting_params.merge(:user_id => User.current.id)
    end
  end

  class ApiParams
    attr_reader :api_params

    def initialize(api_params)
      @api_params = api_params

      if api_params[:feature]
        # set a default targeting type for backward compatibility
        # when `for_feature` was used by the API it automatically set a default
        api_params[:targeting_type] = Targeting::STATIC_TYPE
      end

      if api_params[:search_query].blank? && api_params[:host_ids].present?
        translator = HostIdsTranslator.new(api_params[:host_ids])
        api_params[:search_query] = translator.scoped_search
      end
    end

    def params
      { :job_category => template.job_category,
        :targeting => targeting_params,
        :triggering => triggering_params,
        :description_format => api_params[:description_format],
        :password => api_params[:password],
        :remote_execution_feature_id => remote_execution_feature_id,
        :effective_user_password => api_params[:effective_user_password],
        :concurrency_control => concurrency_control_params,
        :execution_timeout_interval => api_params[:execution_timeout_interval] || template.execution_timeout_interval,
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    def remote_execution_feature_id
      feature&.id || api_params[:remote_execution_feature_id]
    end

    def targeting_params
      raise ::Foreman::Exception, _('Cannot specify both bookmark_id and search_query') if api_params[:bookmark_id] && api_params[:search_query]

      api_params.slice(:targeting_type, :bookmark_id, :search_query, :randomized_ordering).merge(:user_id => User.current.id)
    end

    def triggering_params
      raise ::Foreman::Exception, _('Cannot specify both recurrence and scheduling') if api_params[:recurrence].present? && api_params[:scheduling].present?

      if api_params[:recurrence].present?
        {
          :mode => :recurring,
          :cronline => api_params[:recurrence][:cron_line],
          :end_time => format_datetime(api_params[:recurrence][:end_time]),
          :input_type => :cronline,
          :max_iteration => api_params[:recurrence][:max_iteration],
        }
      elsif api_params[:scheduling].present?
        {
          :mode => :future,
          :start_at_raw => format_datetime(api_params[:scheduling][:start_at]),
          :start_before_raw => format_datetime(api_params[:scheduling][:start_before]),
          :end_time_limited => api_params[:scheduling][:start_before] ? true : false,
        }
      else
        {}
      end
    end

    def concurrency_control_params
      {
        :level => api_params.fetch(:concurrency_control, {})[:concurrency_level],
        :time_span => api_params.fetch(:concurrency_control, {})[:time_span],
      }
    end

    def template_invocations_params
      template_invocation_params = { :template_id => template.id, :effective_user => api_params[:effective_user] }
      template_invocation_params[:provider_input_values] = filter_provider_inputs api_params
      template_invocation_params[:input_values] = api_params.fetch(:inputs, {}).to_h.map do |name, value|
        input = template.template_inputs_with_foreign.find { |i| i.name == name }
        unless input
          raise ::Foreman::Exception, _('Unknown input %{input_name} for template %{template_name}') %
            { :input_name => name, :template_name => template.name }
        end
        { :template_input_id => input.id, :value => value }
      end
      [template_invocation_params]
    end

    def filter_provider_inputs(api_params)
      return [] if template.provider.provider_input_namespace.empty?
      inputs = api_params[template.provider.provider_input_namespace].to_h
      provider_input_names = template.provider.provider_inputs.map(&:name)
      inputs.select { |key, value| provider_input_names.include? key }.map { |key, value| { :name => key, :value => value } }
    end

    def feature
      @feature ||= RemoteExecutionFeature.feature(api_params[:feature]) if api_params[:feature]
    rescue => e
      raise(FeatureNotFound, e.message)
    end

    def job_template_id
      feature&.job_template_id || api_params[:job_template_id]
    end

    def template
      @template ||= JobTemplate.authorized(:view_job_templates).find(job_template_id)
    rescue ActiveRecord::RecordNotFound
      raise(JobTemplateNotFound, _("Template with id '%{id}' was not found") % { id: job_template_id })
    end

    private

    def format_datetime(datetime)
      return datetime if datetime.blank?

      Time.parse(datetime).strftime('%Y-%m-%d %H:%M')
    end
  end

  class ParamsFromJobInvocation
    attr_reader :job_invocation

    def initialize(job_invocation, params = {})
      @job_invocation = job_invocation
      if params[:host_ids]
        @host_ids = params[:host_ids]
      elsif params[:failed_only]
        @host_ids = job_invocation.failed_host_ids
      end
    end

    def params
      { :job_category => job_invocation.job_category,
        :targeting => targeting_params,
        :triggering => triggering_params,
        :description_format => job_invocation.description_format,
        :concurrency_control => concurrency_control_params,
        :execution_timeout_interval => job_invocation.execution_timeout_interval,
        :remote_execution_feature_id => job_invocation.remote_execution_feature_id,
        :template_invocations => template_invocations_params,
        :reruns => job_invocation.id }.with_indifferent_access
    end

    private

    def concurrency_control_params
      {
        :level => job_invocation.concurrency_level,
        :time_span => job_invocation.time_span,
      }
    end

    def targeting_params
      base = { :user_id => User.current.id }
      if @host_ids
        search_query = @host_ids.empty? ? 'name ^ ()' : Targeting.build_query_from_hosts(@host_ids)
        base.merge(:search_query => search_query).merge(job_invocation.targeting.attributes.slice('targeting_type', 'randomized_ordering'))
      else
        base.merge job_invocation.targeting.attributes.slice('search_query', 'bookmark_id', 'targeting_type', 'randomized_ordering')
      end
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

  class HostIdsTranslator
    attr_reader :bookmark, :hosts, :scoped_search, :host_ids

    def initialize(input)
      case input
      when Bookmark
        @bookmark = input
      when Host::Base
        @hosts = [input]
      when Array
        @hosts = input.map do |id|
          Host::Managed.authorized.friendly.find(id)
        end
      when String
        @scoped_search = input
      else
        @hosts = input
      end

      @scoped_search ||= Targeting.build_query_from_hosts(hosts.map(&:id)) if @hosts
    end
  end

  class ParamsForFeature
    attr_reader :feature_label, :feature, :provided_inputs

    def initialize(feature_label, hosts, provided_inputs = {})
      @feature = RemoteExecutionFeature.feature(feature_label)
      @provided_inputs = provided_inputs
      translator = HostIdsTranslator.new(hosts)
      @host_bookmark = translator.bookmark
      @host_scoped_search = translator.scoped_search
    end

    def params
      { :job_category => job_template.job_category,
        :targeting => targeting_params,
        :triggering => {},
        :concurrency_control => {},
        :remote_execution_feature_id => @feature.id,
        :template_invocations => template_invocations_params }.with_indifferent_access
    end

    private

    def targeting_params
      ret = {}
      ret['targeting_type'] = Targeting::STATIC_TYPE
      ret['search_query'] = @host_scoped_search if @host_scoped_search
      ret['bookmark_id'] = @host_bookmark.id if @host_bookmark
      ret['user_id'] = User.current.id
      ret
    end

    def template_invocations_params
      [ { 'template_id' => job_template.id,
          'input_values' => input_values_params } ]
    end

    def input_values_params
      return {} if @provided_inputs.blank?

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
      template = JobTemplate.authorized(:view_job_templates).find_by(id: feature.job_template_id)

      unless template
        raise Foreman::Exception.new(N_('The template %{template_name} mapped to feature %{feature_name} is not accessible by the user'),
          :template_name => template.name,
          :feature_name => feature.name)
      end
      template
    end
  end

  attr_accessor :params, :job_invocation, :host_ids, :search_query
  attr_reader :reruns
  delegate :job_category, :remote_execution_feature_id, :pattern_template_invocations, :template_invocations, :targeting, :triggering, :to => :job_invocation

  def initialize(params, set_defaults = false)
    @params = params
    @set_defaults = set_defaults
    @job_invocation = JobInvocation.new
    @job_invocation.task_group = JobInvocationTaskGroup.new
    @reruns = params[:reruns]
    compose

    @host_ids = validate_host_ids(params[:host_ids])
    @search_query = job_invocation.targeting.search_query if job_invocation.targeting.bookmark_id.blank?
  end

  def self.from_job_invocation(job_invocation, params = {})
    self.new(ParamsFromJobInvocation.new(job_invocation, params).params)
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
    job_invocation.job_category ||= resolve_job_category(available_job_categories.first) { |tempate| template.job_category } if @set_defaults
    job_invocation.remote_execution_feature_id = params[:remote_execution_feature_id]
    job_invocation.targeting = build_targeting
    job_invocation.triggering = build_triggering
    job_invocation.pattern_template_invocations = build_template_invocations
    job_invocation.description_format = params[:description_format]
    job_invocation.time_span = params[:concurrency_control][:time_span].to_i if params[:concurrency_control][:time_span].present?
    job_invocation.concurrency_level = params[:concurrency_control][:level].to_i if params[:concurrency_control][:level].present?
    job_invocation.execution_timeout_interval = params[:execution_timeout_interval]
    job_invocation.password = params[:password]
    job_invocation.key_passphrase = params[:key_passphrase]
    job_invocation.effective_user_password = params[:effective_user_password]

    if @reruns && job_invocation.targeting.static?
      job_invocation.targeting.assign_host_ids(JobInvocation.find(@reruns).targeting.host_ids)
      job_invocation.targeting.mark_resolved!
    end

    job_invocation.job_category = nil unless rerun_possible?

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
    targeting.valid? & job_invocation.valid? & !pattern_template_invocations.map(&:valid?).include?(false) &
      triggering.valid?
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

  def resolve_job_category(default_category)
    resolve_for_composer(default_category) { |form_template| form_template.job_category }
  end

  def resolve_job_template(provider_templates)
    resolve_for_composer(provider_templates.first) do |form_template|
      provider_templates.include?(form_template) ? form_template : provider_templates.first
    end
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

  def input_value_for(input)
    invocations = pattern_template_invocations
    default = TemplateInvocationInputValue.new(:template_input_id => input.id)
    invocations.map(&:input_values).flatten.detect { |iv| iv.template_input_id == input.id } || default
  end

  def job_template_ids
    job_invocation.pattern_template_invocations.map(&:template_id)
  end

  def rerun_possible?
    !(reruns && job_invocation.pattern_template_invocations.empty?)
  end

  private

  # builds input values for a given templates id based on params
  # omits inputs that belongs to unavailable templates
  def build_input_values_for(template_invocation, job_template_base)
    template_invocation.input_values = job_template_base.fetch('input_values', {}).map do |attributes|
      input = template_invocation.template.template_inputs_with_foreign.find { |i| i.id.to_s == attributes[:template_input_id].to_s }
      input ? input.template_invocation_input_values.build(attributes) : nil
    end.compact
    template_invocation.provider_input_values.build job_template_base.fetch('provider_input_values', [])
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
      :search_query => query,
      :randomized_ordering => params[:targeting][:randomized_ordering]
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
    job_invocation.generate_description if job_invocation.description.blank?
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

  def resolve_for_composer(default_value, &block)
    setting_value = Setting['remote_execution_form_job_template']
    return default_value unless setting_value

    form_template = JobTemplate.find_by :name => setting_value
    return default_value unless form_template

    if block_given?
      yield form_template
    else
      form_template
    end
  end
end
