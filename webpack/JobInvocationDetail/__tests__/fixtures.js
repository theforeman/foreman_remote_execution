export const jobInvocationData = {
  search: '',
  per_page: 20,
  page: 1,
  id: 123,
  description: 'Description',
  job_category: 'Commands',
  targeting_id: 123,
  status: 1,
  start_at: '2024-01-01 12:34:56 +0100',
  status_label: 'failed',
  ssh_user: null,
  time_to_pickup: null,
  template_id: 321,
  template_name: 'Run Command - Script Default',
  effective_user: 'root',
  succeeded: 2,
  failed: 4,
  pending: 0,
  cancelled: 0,
  total: 6,
  missing: 5,
  total_hosts: 6,
  task: {
    id: '37ad5ead-51de-4798-bc73-a17687c4d5aa',
    state: 'stopped',
  },
  template_invocations: [
    {
      template_id: 321,
      template_name: 'Run Command - Script Default',
      host_id: 1,
      template_invocation_input_values: [
        {
          template_input_name: 'command',
          template_input_id: 59,
          value:
            'echo start; for i in $(seq 1 120); do echo $i; sleep 1; done; echo done',
        },
      ],
    },
  ],
};

export const jobInvocationDataScheduled = {
  search: '',
  per_page: 20,
  page: 1,
  id: 456,
  description: 'Description',
  job_category: 'Commands',
  targeting_id: 456,
  status: 1,
  start_at: '3000-01-01 12:34:56 +0100',
  status_label: 'failed',
  ssh_user: null,
  time_to_pickup: null,
  template_id: 321,
  template_name: 'Run Command - Script Default',
  effective_user: 'root',
  succeeded: 2,
  failed: 4,
  pending: 0,
  cancelled: 0,
  total: 6,
  missing: 5,
  total_hosts: 6,
};

export const jobInvocationDataRecurring = {
  search: '',
  per_page: 20,
  page: 1,
  id: 789,
  description: 'Description',
  job_category: 'Commands',
  targeting_id: 456,
  status: 2,
  start_at: '3000-01-01 12:00:00 +0100',
  status_label: 'queued',
  ssh_user: null,
  time_to_pickup: null,
  template_id: 321,
  template_name: 'Run Command - Script Default',
  effective_user: 'root',
  succeeded: 0,
  failed: 0,
  pending: 0,
  cancelled: 0,
  total: 'N/A',
  missing: 0,
  total_hosts: 1,
  task: {
    id: '37ad5ead-51de-4798-bc73-a17687c4d5aa',
    state: 'scheduled',
  },
  mode: 'recurring',
  recurrence: {
    id: 1,
    cron_line: '00 12 * * *',
    end_time: null,
    iteration: 1,
    task_group_id: 12,
    state: 'active',
    max_iteration: null,
    purpose: null,
    task_count: 1,
    action: 'Run hosts job:',
    last_occurence: null,
    next_occurence: '3000-01-01 12:00:00 +0100',
  },
};

export const mockPermissionsData = {
  edit_job_templates: true,
  view_foreman_tasks: true,
  edit_recurring_logics: true,
};

export const mockReportTemplatesResponse = {
  results: [{ id: '12', name: 'Job - Invocation Report' }],
};

export const mockReportTemplateInputsResponse = {
  results: [{ id: '34', name: 'job_id' }],
};

const templateInvocationID = 157;

export const jobInvocationOutput = [
  {
    id: 1958,
    template_invocation_id: templateInvocationID,
    timestamp: 1733931147.2044532,
    meta: null,
    external_id: '0',
    output_type: 'stdout',
    output:
      '\u001b[31mThis is red text\u001b[0m\n\u001b[32mThis is green text\u001b[0m\n\u001b[33mThis is yellow text\u001b[0m\n\u001b[34mThis is blue text\u001b[0m\n\u001b[35mThis is magenta text\u001b[0m\n\u001b[36mThis is cyan text\u001b[0m\n\u001b[0mThis is default text\n',
  },
  {
    output_type: 'stdout',
    output: 'Exit status: 6',
    timestamp: 1733931142.2044532,
  },
  {
    output_type: 'stdout',
    output: 'Exit status: 5',
    timestamp: 1733931143.2044532,
  },
  {
    output_type: 'stdout',
    output: 'Exit status: 4',
    timestamp: 1733931144.2044532,
  },
  {
    output_type: 'stdout',
    output: 'Exit status: 3',
    timestamp: 1733931145.2044532,
  },
  {
    output_type: 'stdout',
    output: 'Exit status: 2',
    timestamp: 1733931146.2044532,
  },
  {
    output_type: 'stdout',
    output: 'Exit status: 1',
    timestamp: 1733931147.2044532,
  },

  {
    output_type: 'stdout',
    output: 'Exit status: 0',
    timestamp: 1733931148.2044532,
  },

  {
    id: 1907,
    template_invocation_id: templateInvocationID,
    timestamp: 1718719863.184878,
    meta: null,
    external_id: '15',
    output_type: 'debug',
    output: 'StandardError: Job execution failed',
  },
  {
    id: 1892,
    template_invocation_id: templateInvocationID,
    timestamp: 1718719857.078763,
    meta: null,
    external_id: '0',
    output_type: 'stderr',
    output:
      '[DEPRECATION WARNING]: ANSIBLE_CALLBACK_WHITELIST option, normalizing names to \n',
  },
];

export const mockTemplateInvocationResponse = {
  output: jobInvocationOutput,
  preview: {
    plain: 'PREVIEW TEXT \n TEST',
  },
  input_values: [
    {
      name: 'command',
      value:
        'echo -e "\\e[31mThis is red text\\e[0m"\necho -e "\\e[32mThis is green text\\e[0m"\necho -e "\\e[33mThis is yellow text\\e[0m"\necho -e "\\e[34mThis is blue text\\e[0m"\necho -e "\\e[35mThis is magenta text\\e[0m"\necho -e "\\e[36mThis is cyan text\\e[0m"\necho -e "\\e[0mThis is default text"',
    },
  ],
  job_invocation_description: 'Run tst',
  host_name: 'alton-bennette.iris-starley.kari-stadtler.example.net',
  permissions: {
    view_foreman_tasks: true,
    cancel_job_invocations: true,
    execute_jobs: true,
  },
};
