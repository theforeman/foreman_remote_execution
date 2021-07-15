module Types
  class TargetingEnum < Types::BaseEnum
    Targeting::TYPES.each_key do |key|
      value key
    end
  end
end
