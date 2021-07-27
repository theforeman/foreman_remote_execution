class RexMailNotification < MailNotification
  FAILED_JOBS = N_("Subscribe to my failed jobs")
  SUCCEEDED_JOBS = N_("Subscribe to my succeeded jobs")
  ALL_JOBS = N_("Subscribe to all my jobs")

  def subscription_options
    [
      FAILED_JOBS,
      SUCCEEDED_JOBS,
      ALL_JOBS,
    ]
  end
end
