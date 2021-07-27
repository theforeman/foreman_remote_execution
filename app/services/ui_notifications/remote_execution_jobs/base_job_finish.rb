module UINotifications
  module RemoteExecutionJobs
    class BaseJobFinish < ::UINotifications::Base
      def initialize(job_invocation)
        @subject = job_invocation
      end

      def deliver!
        ::Notification.create!(
          :audience => Notification::AUDIENCE_USER,
          :notification_blueprint => blueprint,
          :initiator => initiator,
          :message => message,
          :subject => subject
        )
      end

      def initiator
        User.anonymous_admin
      end

      def blueprint
        blueprint = @subject.status == HostStatus::ExecutionStatus::ERROR ? 'rex_job_failed' : 'rex_job_succeeded'
        @blueprint ||= NotificationBlueprint.unscoped.find_by(:name => blueprint)
      end

      def message
        UINotifications::StringParser.new(blueprint.message, { subject: subject })
      end
    end
  end
end
