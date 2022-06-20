import configureMockStore from 'redux-mock-store';
import hostsQuery from '../steps/HostsAndInputs/hosts.gql';
import hostgroupsQuery from '../steps/HostsAndInputs/hostgroups.gql';

export const jobTemplate = {
  id: 178,
  name: 'template1',
  template:
    "---\n- hosts: all\n  tasks:\n    - shell:\n        cmd: |\n<%=       indent(10) { input('command') } %>\n      register: out\n    - debug: var=out",
  snippet: false,
  default: true,
  job_category: 'Ansible Commands',
  provider_type: 'Ansible',
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
    {
      name: 'adv plain select',
      required: false,
      input_type: 'user',
      options: 'option 1\r\noption 2\r\noption 3\r\noption 4',
      advanced: true,
      value_type: 'plain',
      resource_type: 'ansible_roles',
      default: '',
      hidden_value: false,
    },
    {
      name: 'adv resource select',
      required: false,
      input_type: 'user',
      value_type: 'resource',
      advanced: true,
      resource_type: 'ForemanTasks::Task',
      default: '',
      hidden_value: false,
    },
    {
      name: 'adv search',
      required: false,
      options: '',
      advanced: true,
      value_type: 'search',
      resource_type: 'foreman_tasks/tasks',
      default: '',
      hidden_value: false,
      url: 'foreman_tasks/tasks',
      resource_type_tableize: 'hosts',
    },
    {
      name: 'adv date',
      required: false,
      options: '',
      advanced: true,
      value_type: 'date',
      resource_type: 'ansible_roles',
      default: '',
      hidden_value: false,
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

export const jobCategories = ['Services', 'Ansible Commands', 'Puppet'];

export const testSetup = (selectors, api) => {
  jest.spyOn(api, 'get');
  jest.spyOn(selectors, 'selectJobTemplate');
  jest.spyOn(selectors, 'selectJobTemplates');
  jest.spyOn(selectors, 'selectJobCategories');
  jest.spyOn(selectors, 'selectJobCategoriesStatus');
  jest.spyOn(selectors, 'selectWithKatello');
  jest.spyOn(selectors, 'selectEffectiveUser');

  jest.spyOn(selectors, 'selectTemplateInputs');
  jest.spyOn(selectors, 'selectAdvancedTemplateInputs');
  selectors.selectWithKatello.mockImplementation(() => true);
  selectors.selectTemplateInputs.mockImplementation(
    () => jobTemplateResponse.template_inputs
  );
  selectors.selectAdvancedTemplateInputs.mockImplementation(
    () => jobTemplateResponse.advanced_template_inputs
  );
  selectors.selectJobCategories.mockImplementation(() => jobCategories);
  selectors.selectJobTemplates.mockImplementation(() => [
    jobTemplate,
    { ...jobTemplate, id: 2, name: 'template2' },
  ]);
  selectors.selectJobTemplate.mockImplementation(() => jobTemplateResponse);

  selectors.selectEffectiveUser.mockImplementation(
    () => jobTemplateResponse.effective_user
  );
  const mockStore = configureMockStore([]);
  const store = mockStore({
    ForemanTasksTask: {
      response: {
        subtotal: 10,
        results: [
          { id: '1', name: 'resource1' },
          { id: '2', name: 'resource2' },
        ],
      },
    },
    HOST_COLLECTIONS: {
      response: {
        subtotal: 3,
        results: [
          { id: '74', name: 'host_collection1' },
          { id: '43', name: 'host_collection2' },
        ],
      },
    },
  });
  return store;
};

export const mockApi = api => {
  api.get.mockImplementation(({ handleSuccess, ...action }) => {
    if (action.key === 'JOB_CATEGORIES') {
      handleSuccess &&
        handleSuccess({
          data: {
            job_categories: jobCategories,
            default_category: 'Ansible Commands',
          },
        });
    } else if (action.key === 'JOB_TEMPLATE') {
      handleSuccess &&
        handleSuccess({
          data: jobTemplateResponse,
        });
    } else if (action.key === 'JOB_TEMPLATES') {
      handleSuccess &&
        handleSuccess({
          data: { results: [jobTemplate] },
        });
    } else if (action.key === 'HOST_IDS') {
      handleSuccess &&
        handleSuccess({
          data: { results: [{ name: 'host1' }, { name: 'host3' }] },
        });
    } else if (action.key === 'REX_FEATURE') {
      handleSuccess &&
        handleSuccess({
          data: { job_template_id: 178 },
        });
    }
    return { type: 'get', ...action };
  });
};

export const gqlMock = [
  {
    request: {
      query: hostsQuery,
      variables: {
        search: 'name~"" and organization_id=1 and location_id=2',
      },
    },
    result: {
      data: {
        hosts: {
          totalCount: 3,
          nodes: [
            { id: 'MDE6SG9zdC0x', name: 'host1' },
            { id: 'MDE6SG9zdC0y', name: 'host2' },
            { id: 'MDE6SG9zdC0z', name: 'host3' },
          ],
        },
      },
    },
  },

  {
    request: {
      query: hostgroupsQuery,
      variables: {
        search: 'name~"" and organization_id=1 and location_id=2',
      },
    },
    result: {
      data: {
        hostgroups: {
          totalCount: 3,
          nodes: [
            { id: 'MDE6SG9zdGdyb3VwLTE=', name: 'host_group1' },
            { id: 'MDE6SG9zdGdyb3VwLTI=', name: 'host_group2' },
            { id: 'MDE6SG9zdGdyb3VwLTM=', name: 'host_group3' },
          ],
        },
      },
    },
  },
];

export const jobInvocation = {
  job: {
    job_category: 'Ansible Commands',
    targeting: {
      user_id: 4,
      search_query: 'name ~ *',
      bookmark_id: null,
      targeting_type: 'static_query',
      randomized_ordering: true,
    },
    triggering: {
      mode: 'immediate',
      start_at: null,
      start_before: null,
    },
    ssh_user: 'ssh user',
    description_format: null,
    concurrency_control: {
      level: 6,
      time_span: 4,
    },
    execution_timeout_interval: 1,
    remote_execution_feature_id: null,
    template_invocations: [
      {
        template_id: 263,
        effective_user: 'Effective user',
        input_values: [
          {
            template_input_id: 162,
            value: 'test command',
          },
        ],
      },
    ],
    reruns: 57,
  },
  job_organization: {
    id: 5,
    name: 'ana-praley',
    created_at: '2021-08-26T13:47:35.655+02:00',
    updated_at: '2021-08-26T13:48:21.435+02:00',
    ignore_types: [],
    description: null,
    label: 'ana-praley',
    ancestry: null,
    title: 'ana-praley',
    manifest_refreshed_at: null,
    created_in_katello: true,
  },
  job_location: {
    id: 2,
    name: 'Default Location',
    created_at: '2021-08-24T15:32:18.830+02:00',
    updated_at: '2021-08-24T15:32:18.830+02:00',
    ignore_types: ['ProvisioningTemplate', 'Hostgroup'],
    description: null,
    label: null,
    ancestry: null,
    title: 'Default Location',
    manifest_refreshed_at: null,
    created_in_katello: false,
  },
  inputs: {
    'inputs[plain hidden]': 'test command',
  },
};
