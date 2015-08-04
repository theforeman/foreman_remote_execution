class JobInvocationsController < ApplicationController
  def new
    @composer = JobInvocationComposer.new(JobInvocation.new,
                                          :host_ids => params[:host_ids],
                                          :targeting => {
                                            :targeting_type => Targeting::STATIC_TYPE,
                                            :bookmark_id => params[:bookmark_id]
                                          })
  end

  def create
    @composer = JobInvocationComposer.new(JobInvocation.new, params)
    if @composer.save
      notice _('Job has been scheduled')
      redirect_to @composer.job_invocation
    else
      render :action => 'new'
    end
  end

  def show
    # TODO authorization
    @job_invocation = JobInvocation.find(params[:id])
  end

  # refreshes the form
  def refresh
    @composer = JobInvocationComposer.new(JobInvocation.new, params)
  end

  class JobInvocationComposer
    attr_accessor :params, :job_invocation, :host_ids, :search_query
    attr_reader :job_template_ids

    # TODO aka initialize_from_params
    def initialize(job_invocation, params)
      @job_invocation = job_invocation
      @params = params

      @host_ids = validate_host_ids(params[:host_ids])
      @search_query = targeting_base[:search_query]

      job_invocation.job_name = validate_job_name(job_invocation_base[:job_name]) || available_job_names.first
      job_invocation.targeting = build_targeting

      @job_template_ids = validate_job_template_ids(job_templates_base.keys)
    end

    def valid?
      targeting.valid? & job_invocation.valid? & !template_invocations.map(&:valid?).include?(false)
    end

    def save
      valid? && job_invocation.save
    end

    def job_name
      job_invocation.job_name
    end

    def targeting
      job_invocation.targeting
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
      TemplateInput.where(:template_id => job_template_ids.nil? ? available_templates_for(job_name).map(&:id) : job_template_ids)
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

    def template_invocations
      if job_invocation.new_record?
        @template_invocations ||= build_template_invocations
      else
        job_invocation.template_invocations
        # TODO update if base present? that would solve updating
      end
    end

    def displayed_search_query
      if @search_query.present?
        @search_query
      elsif host_ids.present?
        targeting.build_query_from_hosts(host_ids)
      elsif targeting.bookmark_id
        if (bookmark = available_bookmarks.find(targeting.bookmark_id))
          bookmark.query
        else
          ''
        end
      else
        ''
      end
    end

    def available_bookmarks
      Bookmark.authorized(:view_bookmarks)
    end

    def targeted_hosts_count
      Host.authorized(:view_hosts).search_for(displayed_search_query).count
    rescue
      0
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

    private

    def targeting_base
      @params.fetch(:targeting, {})
    end

    def job_invocation_base
      @params.fetch(:job_invocation, {})
    end

    def input_values_base
      @params.fetch(:input_values, [])
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
    def job_templates_base
      Hash[providers_base.values.map { |jt| [jt['job_template_id'], (jt['job_templates'] || {})[jt['job_template_id']] || {}] }]
    end

    # builds input values for a given templates id based on params
    # omits inputs that belongs to unavailable templates
    def build_input_values_for(job_template_id)
      job_templates_base[job_template_id.to_s].fetch('input_values', {}).map do |input_id, attributes|
        input = available_template_inputs.find_by_id(input_id)
        input ? input.template_invocation_input_values.build(attributes) : nil
      end.compact
    end

    def build_targeting
      # if bookmark was used we compare it to search query,
      # when it's the same, we delete the query since it is used from bookmark
      # when no bookmark is set we store the query
      bookmark_id = targeting_base[:bookmark_id]
      query = targeting_base[:search_query]
      if bookmark_id.present? && query.present?
        if (bookmark = available_bookmarks.where(:id => bookmark_id).first)
          if query.strip == bookmark.query.strip
            query = nil
          else
            bookmark_id = nil
          end
        else
          query = targeting_base[:search_query]
          bookmark_id = nil
        end
      end

      Targeting.new(
        :user => User.current,
        :bookmark_id => bookmark_id,
        :targeting_type => targeting_base[:targeting_type],
        :search_query => query
      )
    end

    def build_template_invocations
      job_template_ids.map do |job_template_id|
        template_invocation = job_invocation.template_invocations.build(:template_id => job_template_id)
        template_invocation.input_values = build_input_values_for(job_template_id)
        template_invocation
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
      Host.authorized(:view_hosts).where(:id => ids).pluck(:id)
    end
  end
end
