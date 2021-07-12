import configureMockStore from 'redux-mock-store';

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

export const jobCategories = ['Ansible Commands', 'Puppet', 'Services'];

export const testSetup = (selectors, api) => {
  jest.spyOn(api, 'get');
  jest.spyOn(selectors, 'selectJobTemplate');
  jest.spyOn(selectors, 'selectJobTemplates');
  jest.spyOn(selectors, 'selectJobCategories');
  jest.spyOn(selectors, 'selectJobCategoriesStatus');

  jest.spyOn(selectors, 'selectTemplateInputs');
  jest.spyOn(selectors, 'selectAdvancedTemplateInputs');
  jest.spyOn(selectors, 'selectResponse');
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

  selectors.selectResponse.mockImplementation((state, key) => {
    if (key === 'HOSTS') {
      return {
        results: [{ name: 'host1' }, { name: 'host2' }, { name: 'host3' }],
        subtotal: 3,
      };
    } else if (key === 'HOST_GROUPS') {
      return {
        results: [
          { name: 'host_group1' },
          { name: 'host_group2' },
          { name: 'host_group3' },
        ],
        subtotal: 3,
      };
    }
    return {};
  });
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
  });
  return store;
};

export const mockApi = api => {
  api.get.mockImplementation(({ handleSuccess, ...action }) => {
    if (action.key === 'JOB_CATEGORIES') {
      handleSuccess &&
        handleSuccess({ data: { job_categories: jobCategories } });
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
    }
    return { type: 'get', ...action };
  });
};
