import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount } from '@theforeman/test';
import { render, fireEvent, screen, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../JobWizard';
import * as selectors from '../JobWizardSelectors';
import { jobTemplates, jobTemplateResponse as jobTemplate } from './fixtures';

jest.spyOn(api, 'get');
jest.spyOn(selectors, 'selectJobTemplate');
jest.spyOn(selectors, 'selectJobTemplates');
jest.spyOn(selectors, 'selectJobCategories');
jest.spyOn(selectors, 'selectJobCategoriesStatus');
jest.spyOn(selectors, 'selectEffectiveUser');
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
  }
  return { type: 'get', ...action };
});

selectors.selectJobTemplate.mockImplementation(() => null);
selectors.selectJobCategories.mockImplementation(() => jobCategories);
selectors.selectJobCategoriesStatus.mockImplementation(() => null);
selectors.selectJobTemplates.mockImplementation(() => jobTemplates);

const mockStore = configureMockStore([]);
const store = mockStore({});
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

  it('should save data between steps for advanced fields', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <JobWizard advancedValues={{}} setAdvancedValues={jest.fn()} />
      </Provider>
    );
    // setup
    selectors.selectJobCategoriesStatus.mockImplementation(() => 'RESOLVED');
    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);
    selectors.selectEffectiveUser.mockImplementation(
      () => jobTemplate.effective_user
    );
    selectors.selectTemplateInputs.mockImplementation(
      () => jobTemplate.template_inputs_with_foreign
    );
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
    const advancedTemplateInput = () =>
      wrapper.find('.pf-c-form__group-control textarea');
    const effectiveUesrValue = 'effective user new value';
    const advancedTemplateInputValue = 'advanced input new value';
    effectiveUserInput().getDOMNode().value = effectiveUesrValue;
    await act(async () => {
      await effectiveUserInput().simulate('change');
      wrapper.update();
    });
    advancedTemplateInput().getDOMNode().value = advancedTemplateInputValue;
    advancedTemplateInput().simulate('change');

    expect(effectiveUserInput().prop('value')).toEqual(effectiveUesrValue);
    expect(advancedTemplateInput().prop('value')).toEqual(
      advancedTemplateInputValue
    );

    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(1)
      .simulate('click');

    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-current').text()).toEqual(
      'Target Hosts'
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(2)
      .simulate('click'); // Advanced step

    expect(effectiveUserInput().prop('value')).toEqual(effectiveUesrValue);
    expect(advancedTemplateInput().prop('value')).toEqual(
      advancedTemplateInputValue
    );
  });

  it('have all steps', async () => {
    selectors.selectJobCategoriesStatus.mockImplementation(() => null);
    selectors.selectJobTemplate.mockRestore();
    selectors.selectJobTemplates.mockRestore();
    selectors.selectJobCategories.mockRestore();
    api.get.mockImplementation(({ handleSuccess, ...action }) => {
      if (action.key === 'JOB_CATEGORIES') {
        handleSuccess &&
          handleSuccess({ data: { job_categories: jobCategories } });
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
