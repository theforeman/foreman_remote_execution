/* eslint-disable max-lines */
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from '@theforeman/test';
import { fireEvent, screen, render, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import {
  jobTemplateResponse,
  jobTemplate,
  testSetup,
  mockApi,
  jobCategories,
  gqlMock,
} from '../../../__tests__/fixtures';
import { WIZARD_TITLES } from '../../../JobWizardConstants';

const lodash = require('lodash');

lodash.debounce = fn => fn;
const store = testSetup(selectors, api);
mockApi(api);

jest.spyOn(selectors, 'selectEffectiveUser');
jest.useFakeTimers();

selectors.selectEffectiveUser.mockImplementation(
  () => jobTemplateResponse.effective_user
);
describe('AdvancedFields', () => {
  it('should save data between steps for advanced fields', async () => {
    const wrapper = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    // setup
    wrapper.find('.pf-c-button.pf-c-select__toggle-button').simulate('click');
    wrapper
      .find('.pf-c-select__menu-item')
      .first()
      .simulate('click');

    // test
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      0
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(2)
      .simulate('click'); // Advanced step

    await act(async () => {
      jest.runAllTimers(); // to handle pf4 date picker popover
    });
    const effectiveUserInput = () => wrapper.find('input#effective-user');
    const advancedTemplateInput = () =>
      wrapper.find('.pf-c-form__group-control textarea');
    const effectiveUesrValue = 'effective user new value';
    const advancedTemplateInputValue = 'advanced input new value';
    effectiveUserInput().getDOMNode().value = effectiveUesrValue;

    effectiveUserInput().simulate('change');
    wrapper.update();
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
      'Target hosts and inputs'
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(2)
      .simulate('click'); // Advanced step

    await act(async () => {
      jest.runOnlyPendingTimers(); // to handle pf4 date picker popover
    });
    expect(effectiveUserInput().prop('value')).toEqual(effectiveUesrValue);
    expect(advancedTemplateInput().prop('value')).toEqual(
      advancedTemplateInputValue
    );
  });
  it('fill template fields', async () => {
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
      jest.runOnlyPendingTimers(); // to handle pf4 date picker popover
    });

    const searchValue = 'search test';
    const textValue = 'I am a text';
    const dateValue = '2022/06/24';
    const timeValue = '12:34:56';
    const textField = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    const selectField = screen.getByLabelText('adv plain select toggle');
    const resourceSelectField = screen.getByLabelText(
      'adv resource select toggle'
    );
    const searchField = screen.getByPlaceholderText('Filter...');
    const dateField = screen.getByLabelText('adv date datepicker');
    const timeField = screen.getByLabelText('adv date timepicker');

    fireEvent.click(selectField);
    await act(async () => {
      await fireEvent.click(screen.getByText('option 2'));
      fireEvent.click(screen.getAllByText(WIZARD_TITLES.advanced)[0]); // to remove focus

      fireEvent.click(resourceSelectField);
      fireEvent.click(screen.getByText('resource2'));
      fireEvent.change(textField, {
        target: { value: textValue },
      });
      fireEvent.change(searchField, {
        target: { value: searchValue },
      });
      await fireEvent.change(dateField, {
        target: { value: dateValue },
      });
      fireEvent.change(timeField, {
        target: { value: timeValue },
      });
      jest.runAllTimers(); // to handle pf4 date picker popover
    });
    expect(
      screen.getByLabelText('adv plain hidden', {
        selector: 'textarea',
      }).value
    ).toBe(textValue);
    expect(searchField.value).toBe(searchValue);
    expect(screen.getByLabelText('adv date datepicker').value).toBe(dateValue);
    expect(timeField.value).toBe(timeValue);
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.categoryAndTemplate));
    });
    expect(screen.getAllByText(WIZARD_TITLES.categoryAndTemplate)).toHaveLength(
      3
    );

    await act(async () => {
      await fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
      jest.runOnlyPendingTimers();
    });
    expect(textField.value).toBe(textValue);
    expect(searchField.value).toBe(searchValue);
    expect(dateField.value).toBe(dateValue);
    expect(timeField.value).toBe(timeValue);
    expect(screen.queryAllByText('option 1')).toHaveLength(0);
    expect(screen.queryAllByText('option 2')).toHaveLength(1);
    expect(screen.queryAllByDisplayValue('resource1')).toHaveLength(0);
    expect(screen.queryAllByDisplayValue('resource2')).toHaveLength(1);
  });
  it('fill defaults into fields', async () => {
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
      jest.runAllTimers(); // to handle pf4 date picker popover
    });

    expect(
      screen.getByLabelText('ssh user', {
        selector: 'input',
      }).value
    ).toBe('');
    expect(
      screen.getByLabelText('effective user', {
        selector: 'input',
      }).value
    ).toBe('default effective user');
    expect(
      screen.getByLabelText('timeout to kill', {
        selector: 'input',
      }).value
    ).toBe('2');

    expect(
      screen.getByLabelText('description preview', {
        selector: 'input',
      }).value
    ).toBe(
      'template1 with inputs adv plain hidden="Default val" adv plain select="" adv resource select="" adv search="" adv date="" plain hidden="Default val"'
    );
  });
  it('DescriptionField', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
      jest.runAllTimers(); // to handle pf4 date picker popover
    });

    const textField = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    await act(async () => {
      await fireEvent.change(textField, {
        target: { value: 'test command' },
      });
    });
    const descriptionValue = 'Run %{adv plain hidden} %{wrong command name}';

    await act(async () => {
      fireEvent.click(screen.getByText('Edit job description template'));
    });

    const editText = screen.getByLabelText('description edit', {
      selector: 'input',
    });
    await fireEvent.change(editText, {
      target: { value: descriptionValue },
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Preview job description'));
    });
    expect(
      screen.getByLabelText('description preview', {
        selector: 'input',
      }).value
    ).toBe('Run test command %{wrong command name}');
  });

  it('DescriptionField with no inputs', async () => {
    jest.spyOn(api, 'get');

    jest.spyOn(selectors, 'selectTemplateInputs');
    jest.spyOn(selectors, 'selectAdvancedTemplateInputs');
    selectors.selectTemplateInputs.mockImplementation(() => []);
    selectors.selectAdvancedTemplateInputs.mockImplementation(() => []);
    api.get.mockImplementation(({ handleSuccess, ...action }) => {
      if (action.key === 'JOB_CATEGORIES') {
        handleSuccess &&
          handleSuccess({ data: { job_categories: jobCategories } });
      } else if (action.key === 'JOB_TEMPLATE') {
        handleSuccess &&
          handleSuccess({
            data: {
              ...jobTemplateResponse,
              advanced_template_inputs: [],
              template_inputs: [],
            },
          });
      } else if (action.key === 'JOB_TEMPLATES') {
        handleSuccess &&
          handleSuccess({
            data: { results: [jobTemplate] },
          });
      }
      return { type: 'get', ...action };
    });
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
      jest.runAllTimers(); // to handle pf4 date picker popover
    });
    expect(
      screen.getByLabelText('description preview', {
        selector: 'input',
      }).value
    ).toBe('template1');
  });

  it('DescriptionField with description_format', async () => {
    jest.spyOn(api, 'get');
    jest.spyOn(selectors, 'selectTemplateInputs');
    selectors.selectTemplateInputs.mockImplementation(() => [
      {
        name: 'command',
        required: true,
        input_type: 'user',
        description: 'some Description',
        advanced: true,
        value_type: 'plain',
        resource_type: 'ansible_roles',
        default: 'Default val',
        hidden_value: true,
      },
    ]);
    api.get.mockImplementation(({ handleSuccess, ...action }) => {
      if (action.key === 'JOB_CATEGORIES') {
        handleSuccess &&
          handleSuccess({ data: { job_categories: jobCategories } });
      } else if (action.key === 'JOB_TEMPLATE') {
        handleSuccess &&
          handleSuccess({
            data: {
              ...jobTemplateResponse,
              job_template: {
                ...jobTemplateResponse.jobTemplate,
                description_format: 'Run %{command}',
              },

              template_inputs: [
                {
                  name: 'command',
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
            },
          });
      } else if (action.key === 'JOB_TEMPLATES') {
        handleSuccess &&
          handleSuccess({
            data: { results: [jobTemplate] },
          });
      }
      return { type: 'get', ...action };
    });
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
      jest.runAllTimers(); // to handle pf4 date picker popover
    });
    expect(
      screen.getByLabelText('description preview', {
        selector: 'input',
      }).value
    ).toBe('Run Default val');
  });

  it('search resources action', async () => {
    jest.useFakeTimers();
    mockApi(api);
    const newStore = testSetup(selectors, api);
    render(
      <Provider store={newStore}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
      jest.runAllTimers(); // to handle pf4 date picker popover
    });
    const resourceSelectField = screen.getByLabelText(
      'adv resource select typeahead input'
    );

    await act(async () => {
      await fireEvent.change(resourceSelectField, {
        target: { value: 'some search' },
      });

      jest.runAllTimers();
    });
    expect(newStore.getActions()).toMatchSnapshot('resource search');
  });
});
