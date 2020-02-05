module Foreman::Controller::Parameters::Targeting
  extend ActiveSupport::Concern

  class_methods do
    def targeting_params_filter
      Foreman::ParameterFilter.new(::Targeting).tap do |filter|
        filter.permit_by_context :targeting_type, :bookmark_id, :user, :search_query, :location_id, :organization_id, :nested => true
      end
    end
  end
end
