class JobInvocationsController < ApplicationController
  def new
    hosts = Host.authorized(:view_hosts).where(:id => params[:host_ids])
    @job_invocation = JobInvocation.new(:hosts => hosts)
  end
end
