class HostProxyInvocation < ApplicationRecord
  belongs_to :host, :class_name => 'Host::Managed', :inverse_of => :host_proxy_invocations
  belongs_to :smart_proxy
end
