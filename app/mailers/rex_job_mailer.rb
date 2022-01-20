class RexJobMailer < ApplicationMailer
  helper ApplicationHelper

  def job_finished(job, opts = {})
    @job = job
    @subject = opts[:subject] || _('REX job has finished - %s') % @job.to_s

    if @job.user.nil?
      Rails.logger.warn 'Job user no longer exist, skipping email notification'
      return
    end

    mail(to: @job.user.mail, subject: @subject)
  end
end
