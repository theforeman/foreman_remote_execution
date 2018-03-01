require 'foreman_tasks_core'

module ForemanRemoteExecutionCore
  extend ForemanTasksCore::SettingsLoader
  register_settings([:remote_execution_ssh, :smart_proxy_remote_execution_ssh_core],
                    :ssh_identity_key_file   => '~/.ssh/id_rsa_foreman_proxy',
                    :ssh_user                => 'root',
                    :remote_working_dir      => '/var/tmp',
                    :local_working_dir       => '/var/tmp',
                    :kerberos_auth           => false,
                    :async_ssh               => false,
                    # When set to nil, makes REX use the runner's default interval
                    :runner_refresh_interval => nil,
                    :ssh_log_level           => :fatal)

  SSH_LOG_LEVELS = %w(debug info warn error fatal).freeze

  def self.simulate?
    %w(yes true 1).include? ENV.fetch('REX_SIMULATE', '').downcase
  end

  def self.validate_settings!
    super
    self.validate_ssh_log_level!
    @settings[:ssh_log_level] = @settings[:ssh_log_level].to_sym
  end

  def self.validate_ssh_log_level!
    wanted_level = @settings[:ssh_log_level].to_s
    unless SSH_LOG_LEVELS.include? wanted_level
      raise "Wrong value '#{@settings[:ssh_log_level]}' for ssh_log_level, must be one of #{SSH_LOG_LEVELS.join(', ')}"
    end

    current = if defined?(SmartProxyDynflowCore)
                SmartProxyDynflowCore::SETTINGS.log_level.to_s.downcase
              else
                Rails.configuration.log_level.to_s
              end

    # regular log levels correspond to upcased ssh logger levels
    ssh, regular = [wanted_level, current].map do |wanted|
      SSH_LOG_LEVELS.each_with_index.find { |value, _index| value == wanted }.last
    end

    if ssh < regular
      raise 'ssh_log_level cannot be more verbose than regular log level'
    end
  end

  def self.runner_class
    @runner_class ||= if simulate?
                        FakeScriptRunner
                      elsif settings[:async_ssh]
                        PollingScriptRunner
                      else
                        ScriptRunner
                      end
  end

  if ForemanTasksCore.dynflow_present?
    require 'foreman_tasks_core/runner'
    require 'foreman_remote_execution_core/log_filter'
    if simulate?
      # Load the fake implementation of the script runner if debug is enabled
      require 'foreman_remote_execution_core/fake_script_runner'
    else
      require 'foreman_remote_execution_core/script_runner'
      require 'foreman_remote_execution_core/polling_script_runner'
    end
    require 'foreman_remote_execution_core/dispatcher'
    require 'foreman_remote_execution_core/actions'
  end

  require 'foreman_remote_execution_core/version'
end
