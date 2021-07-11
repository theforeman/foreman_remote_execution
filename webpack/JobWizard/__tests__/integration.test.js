import React from 'react';
import { Provider } from 'react-redux';
import { mount } from '@theforeman/test';
import { render, fireEvent, screen, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../JobWizard';
import * as selectors from '../JobWizardSelectors';
import {
  testSetup,
  mockApi,
  jobCategories,
  jobTemplateResponse as jobTemplate,
} from './fixtures';

const store = testSetup(selectors, api);

selectors.selectJobTemplate.mockImplementation(() => {});
jest.spyOn(selectors, 'selectEffectiveUser');
jest.spyOn(selectors, 'selectTemplateInputs');
jest.spyOn(selectors, 'selectAdvancedTemplateInputs');

api.get.mockImplementation(({ handleSuccess, ...action }) => {
  if (action.key === 'JOB_CATEGORIES') {
    handleSuccess && handleSuccess({ data: { job_categories: jobCategories } });
  }
  return { type: 'get', ...action };
});
describe('Job wizard fill', () => {
  it('should select template', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <JobWizard advancedValues={{}} setAdvancedValues={jest.fn()} />
      </Provider>
    );
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      4
    );
    selectors.selectJobCategoriesStatus.mockImplementation(() => 'RESOLVED');
    expect(store.getActions()).toMatchSnapshot('initial');

    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);
    wrapper.find('.pf-c-button.pf-c-select__toggle-button').simulate('click');
    await act(async () => {
      await wrapper.find('.pf-c-select__menu-item').simulate('click');
      await wrapper.update();
    });
    expect(store.getActions().slice(-1)).toMatchSnapshot('select template');
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      0
    );
  });

  it('have all steps', async () => {
    selectors.selectJobCategoriesStatus.mockImplementation(() => null);
    selectors.selectJobTemplate.mockRestore();
    selectors.selectJobTemplates.mockRestore();
    selectors.selectJobCategories.mockRestore();
    mockApi(api);

    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    const steps = [
      'Target Hosts',
      'Advanced Fields',
      'Schedule',
      'Review Details',
      'Category and Template',
    ];
    // eslint-disable-next-line no-unused-vars
    for await (const step of steps) {
      const stepSelector = screen.getByText(step);
      const stepTitle = screen.getAllByText(step);
      expect(stepTitle).toHaveLength(1);
      await act(async () => {
        await fireEvent.click(stepSelector);
      });
      const stepTitles = screen.getAllByText(step);
      expect(stepTitles).toHaveLength(3);
    }
  });
});
