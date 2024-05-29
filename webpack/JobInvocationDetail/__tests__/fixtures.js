export const jobInvocationData = {
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
