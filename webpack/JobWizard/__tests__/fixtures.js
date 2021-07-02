const jobTemplate = {
  id: 178,
  name: 'Run Command - Ansible Default',
  template:
    "---\n- hosts: all\n  tasks:\n    - shell:\n        cmd: |\n<%=       indent(10) { input('command') } %>\n      register: out\n    - debug: var=out",
  snippet: false,
  default: true,
  job_category: 'Ansible Commands',
  provider_type: 'Ansible',
  description_format: 'Run %{command}',
  execution_timeout_interval: 2,
  description: null,
};

export const jobTemplates = [jobTemplate];

export const jobTemplateResponse = {
  job_template: jobTemplate,
  effective_user: {
    id: null,
    job_template_id: 178,
    value: 'default effective user',
    overridable: true,
    current_user: false,
  },
  advanced_template_inputs: [
    {
      name: 'adv plain hidden',
      required: true,
      input_type: 'user',
      description: 'some Description',
      advanced: true,
      value_type: 'plain',
      resource_type: 'ansible_roles',
      default: 'Default val',
      hidden_value: true,
    },
  ],
  template_inputs: [
    {
      name: 'plain hidden',
      required: true,
      input_type: 'user',
      description: 'some Description',
      advanced: false,
      value_type: 'plain',
      resource_type: 'ansible_roles',
      default: 'Default val',
      hidden_value: true,
    },
  ],
};
