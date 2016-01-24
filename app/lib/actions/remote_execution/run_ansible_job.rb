module Actions
  module RemoteExecution
    class RunAnsibleJob < RunHostJob
      def plan(job_invocation, host, template_invocation, proxy)
        super(job_invocation, host, template_invocation, proxy)

        ansible_template = AnsibleTemplateRenderer.new(
          template_invocation.template,
          nil,
          template_invocation)

        provider = template_invocation.template.provider
        ansible_command = plan_action(
          RunProxyAnsibleCommand,
          proxy,
          ansible_template.inventory,
          ansible_template.playbook,
          provider.proxy_command_options(template_invocation, host))
      end
    end
  end
end
