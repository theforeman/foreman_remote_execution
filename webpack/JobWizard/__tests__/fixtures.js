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
};
