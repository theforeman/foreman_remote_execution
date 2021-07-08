import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount } from '@theforeman/test';
import { act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import { jobTemplateResponse as jobTemplate } from '../../../__tests__/fixtures';

jest.spyOn(api, 'get');
jest.spyOn(selectors, 'selectJobTemplate');
jest.spyOn(selectors, 'selectTemplateInputs');

const jobCategories = ['Ansible Commands', 'Puppet', 'Services'];

api.get.mockImplementation(({ handleSuccess, ...action }) => {
  if (action.key === 'JOB_CATEGORIES') {
    handleSuccess && handleSuccess({ data: { job_categories: jobCategories } });
  } else if (action.key === 'JOB_TEMPLATE') {
    handleSuccess &&
      handleSuccess({
        data: jobTemplate,
      });
  } else if (action.key === 'JOB_TEMPLATES') {
    handleSuccess &&
      handleSuccess({
        data: { results: [jobTemplate.job_template] },
      });
  }
  return { type: 'get', ...action };
});

const mockStore = configureMockStore([]);
const store = mockStore({});

describe('TemplateInputs', () => {
  it('should save data between steps for template input fields', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <JobWizard advancedValues={{}} setAdvancedValues={jest.fn()} />
      </Provider>
    );
    // setup
    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);

    wrapper.find('.pf-c-button.pf-c-select__toggle-button').simulate('click');
    wrapper.find('.pf-c-select__menu-item').simulate('click');

    // test
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(1)
      .simulate('click'); // Host and Inputs step
    const userTemplateInput = () => wrapper.find('textarea#plain-hidden');
    const templateInputNewValue = 'new value';
    userTemplateInput().getDOMNode().value = templateInputNewValue;
    await act(async () => {
      await userTemplateInput().simulate('change');
      wrapper.update();
    });

    expect(userTemplateInput().prop('value')).toEqual(templateInputNewValue);

    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(1)
      .simulate('click');

    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-current').text()).toEqual(
      'Target hosts and inputs'
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(1)
      .simulate('click'); // Host and Inputs step

    expect(userTemplateInput().prop('value')).toEqual(templateInputNewValue);
  });
});
