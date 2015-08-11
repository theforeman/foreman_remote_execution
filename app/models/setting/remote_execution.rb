class Setting::RemoteExecution < Setting

  def self.load_defaults
    # Check the table exists
    return unless super

    self.transaction do
      [
          self.set('remote_execution_global_proxy', N_("Allows searching for remote execution proxy outside of the proxies assigned to the host: useful when missing the host proxies associations"), false),
      ].each { |s| self.create! s.update(:category => "Setting::RemoteExecution")}
    end

    true

  end

end
