N_('Remote execution job')

notifications = [
  {
    :name               => 'remote_execution_job',
    :description        => N_('A notification when a job finishes'),
    :mailer             => 'RexJobMailer',
    :method             => 'job_finished',
    :subscription_type  => 'alert',
  },
]

notifications.each do |notification|
  if (mail = RexMailNotification.find_by(name: notification[:name]))
    mail.attributes = notification
    mail.save! if mail.changed?
  else
    created_notification = RexMailNotification.create(notification)
    if created_notification.nil? || created_notification.errors.any?
      raise ::Foreman::Exception.new(N_("Unable to create mail notification: %s"),
        format_errors(created_notification))
    end
  end
end
