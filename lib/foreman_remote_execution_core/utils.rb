require 'open3'

module ForemanRemoteExecutionCore
  module Utils
    class << self
      def prune_known_hosts!(hostname, port, logger = Logger.new($stdout))
        return if Net::SSH::KnownHosts.search_for(hostname).empty?

        target = if port == 22
                   hostname
                 else
                   "[#{hostname}]:#{port}"
                 end

        Open3.popen3('ssh-keygen', '-R', target) do |_stdin, stdout, _stderr, wait_thr|
          wait_thr.join
          stdout.read
        end
      rescue Errno::ENOENT => e
        logger.warn("Could not remove #{hostname} from know_hosts: #{e}")
      end
    end
  end
end
