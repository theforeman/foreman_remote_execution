import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount } from '@theforeman/test';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../JobWizard';
import * as selectors from '../JobWizardSelectors';

jest.spyOn(api, 'get');
jest.spyOn(selectors, 'selectJobTemplate');
jest.spyOn(selectors, 'selectJobTemplates');
jest.spyOn(selectors, 'selectJobCategories');
jest.spyOn(selectors, 'selectJobCategoriesStatus');

const jobCategories = ['Ansible Commands', 'Puppet', 'Services'];

api.get.mockImplementation(({ handleSuccess, ...action }) => {
  if (action.key === 'JOB_CATEGORIES') {
    handleSuccess && handleSuccess({ data: { job_categories: jobCategories } });
  } else if (action.key === 'JOB_TEMPLATE') {
    handleSuccess &&
      handleSuccess({
        data: {
          job_template: {
            execution_timeout_interval: 2,
          },
          effective_user: {
            value: 'default effective user',
          },
        },
      });
  }
  return { type: 'get', ...action };
});

selectors.selectJobTemplate.mockImplementation(() => null);
selectors.selectJobCategories.mockImplementation(() => jobCategories);
selectors.selectJobCategoriesStatus.mockImplementation(() => null);
selectors.selectJobTemplates.mockImplementation(() => jobTemplates);

const jobTemplates = [
  {
    id: 178,
    name: 'Run Command - Ansible Default',
    job_category: 'Ansible Commands',
    provider_type: 'Ansible',
    snippet: false,
    description_format: 'Run %{command}',
  },
];
const jobTemplate = {
  job_template: {
    id: 178,
    name: 'Run Command - Ansible Default',
    template:
      "---\n- hosts: all\n  tasks:\n    - shell:\n        cmd: |\n<%=       indent(10) { input('command') } %>\n      register: out\n    - debug: var=out",
    snippet: false,
    default: true,
    job_category: 'Ansible Commands',
    provider_type: 'Ansible',
    description_format: 'Run %{command}',
    execution_timeout_interval: null,
    description: null,
  },
  effective_user: {
    id: null,
    job_template_id: 178,
    value: null,
    overridable: true,
    current_user: false,
  },
};

const mockStore = configureMockStore([]);
const store = mockStore({ effective_user: { overridable: true } });
describe('Job wizard fill', () => {
  it('should select template', () => {
    const wrapper = mount(
      <Provider store={store}>
        <JobWizard advancedValue={{}} setAdvancedValue={jest.fn()} />
      </Provider>
    );
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      4
    );
    selectors.selectJobCategoriesStatus.mockImplementation(() => 'RESOLVED');
    expect(store.getActions()).toMatchSnapshot('initial');

    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);
    wrapper.find('.pf-c-button.pf-c-select__toggle-button').simulate('click');
    wrapper.find('.pf-c-select__menu-item').simulate('click');
    expect(store.getActions().slice(-1)).toMatchSnapshot('select template');
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      0
    );
  });
  it('should save data between steps for advanced fields', () => {
    const wrapper = mount(
      <Provider store={store}>
        <JobWizard advancedValue={{}} setAdvancedValue={jest.fn()} />
      </Provider>
    );
    // setup
    selectors.selectJobCategoriesStatus.mockImplementation(() => 'RESOLVED');
    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);
    wrapper.find('.pf-c-button.pf-c-select__toggle-button').simulate('click');
    wrapper.find('.pf-c-select__menu-item').simulate('click');

    // test
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      0
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(2)
      .simulate('click'); // Advanced step
    const effectiveUserInput = () => wrapper.find('input#effective-user');
    const effectiveUesrValue = 'effective user new value';
    effectiveUserInput().getDOMNode().value = effectiveUesrValue;
    effectiveUserInput().simulate('change');
    expect(effectiveUserInput().prop('value')).toEqual(effectiveUesrValue);

    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(1)
      .simulate('click');

    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-current').text()).toEqual(
      'Target hosts'
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(2)
      .simulate('click'); // Advanced step

    expect(effectiveUserInput().prop('value')).toEqual(effectiveUesrValue);
  });
});
