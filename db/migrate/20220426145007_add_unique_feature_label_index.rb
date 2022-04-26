# frozen_string_literal: true

class AddUniqueFeatureLabelIndex < ActiveRecord::Migration[6.0]
  def change
    remove_index :remote_execution_features, :label

    counts = RemoteExecutionFeature.group(:label).count
    counts.select { |_, count| count > 1 }.each do |label, count|
      RemoteExecutionFeature.where(label: label).limit(count - 1).delete_all
    end

    add_index :remote_execution_features, :label, unique: true
  end
end
