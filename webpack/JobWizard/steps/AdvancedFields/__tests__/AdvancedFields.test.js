/* eslint-disable max-lines */
import React from 'react';
import { Provider } from 'react-redux';
import { screen, render, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
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

jest.useFakeTimers();

const clickOptions = { skipHover: true };

const wizardStepButton = title =>
  screen.getByText(title, { selector: 'button' });

const clickWizardStep = async title => {
  await act(async () => {
    fireEvent.click(wizardStepButton(title));
    jest.advanceTimersByTime(1000);
  });
};

const typeIntoField = async (field, value) => {
  await act(async () => {
    await userEvent.click(field, {}, clickOptions);
    await userEvent.clear(field);
    userEvent.paste(field, value);
    jest.advanceTimersByTime(1000);
  });
};

const renderJobWizard = ({ customStore = store, withGql = true } = {}) => {
  const wizard = (
    <Provider store={customStore}>
      <JobWizard />
    </Provider>
  );

  if (withGql) {
    return render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        {wizard}
      </MockedProvider>
    );
  }

  return render(wizard);
};

const goToAdvancedStep = async () => {
  await clickWizardStep(WIZARD_TITLES.advanced);
};

describe('AdvancedFields', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'selectRouterSearch');
    selectors.selectRouterSearch.mockImplementation(() => ({
      'host_ids[]': ['105', '37'],
    }));
  });

  afterEach(() => {
    selectors.selectRouterSearch.mockRestore();
  });

  it('preserves advanced field values when navigating between wizard steps', async () => {
    renderJobWizard();
    await goToAdvancedStep();

    const effectiveUserInput = screen.getByLabelText('effective user', {
      selector: 'input',
    });
    const advancedTemplateInput = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    const effectiveUserValue = 'effective user new value';
    const advancedTemplateInputValue = 'advanced input new value';

    await typeIntoField(effectiveUserInput, effectiveUserValue);
    await typeIntoField(advancedTemplateInput, advancedTemplateInputValue);

    expect(effectiveUserInput).toHaveValue(effectiveUserValue);
    expect(advancedTemplateInput).toHaveValue(advancedTemplateInputValue);

    await clickWizardStep(WIZARD_TITLES.hostsAndInputs);
    expect(wizardStepButton(WIZARD_TITLES.hostsAndInputs)).toHaveAttribute(
      'aria-current',
      'step'
    );

    await goToAdvancedStep();

    expect(effectiveUserInput).toHaveValue(effectiveUserValue);
    expect(advancedTemplateInput).toHaveValue(advancedTemplateInputValue);
  });

  it('preserves template field values when navigating between wizard steps', async () => {
    renderJobWizard();
    await goToAdvancedStep();

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
    const searchField = screen.getByPlaceholderText('Search');
    const dateField = screen.getByLabelText('adv date datepicker');
    const timeField = screen.getByLabelText('adv date timepicker');

    fireEvent.click(selectField);
    await act(async () => {
      await userEvent.click(screen.getByText('option 2'), {}, clickOptions);
      await userEvent.click(
        screen.getAllByText(WIZARD_TITLES.advanced)[0],
        {},
        clickOptions
      );

      await userEvent.click(resourceSelectField, {}, clickOptions);
      await userEvent.click(screen.getByText('resource2'), {}, clickOptions);
      await typeIntoField(textField, textValue);
      await typeIntoField(searchField, searchValue);
      fireEvent.change(dateField, { target: { value: dateValue } });
      fireEvent.change(timeField, { target: { value: timeValue } });
      jest.advanceTimersByTime(1000);
    });

    expect(textField).toHaveValue(textValue);
    expect(searchField).toHaveValue(searchValue);
    expect(dateField).toHaveValue(dateValue);
    expect(timeField).toHaveValue(timeValue);

    await clickWizardStep(WIZARD_TITLES.categoryAndTemplate);
    expect(screen.getAllByText(WIZARD_TITLES.categoryAndTemplate)).toHaveLength(
      3
    );

    await goToAdvancedStep();

    expect(textField).toHaveValue(textValue);
    expect(searchField).toHaveValue(searchValue);
    expect(dateField).toHaveValue(dateValue);
    expect(timeField).toHaveValue(timeValue);
    expect(screen.queryByText('option 1')).not.toBeInTheDocument();
    expect(screen.getByText('option 2')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('resource1')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('resource2')).toBeInTheDocument();
  });

  it('fills default values into advanced fields', async () => {
    renderJobWizard();
    await goToAdvancedStep();

    expect(
      screen.getByLabelText('ssh user', { selector: 'input' })
    ).toHaveValue('');
    expect(
      screen.getByLabelText('effective user', { selector: 'input' })
    ).toHaveValue('default effective user');
    expect(
      screen.getByLabelText('timeout to kill', { selector: 'input' })
    ).toHaveValue('2');
    expect(
      screen.getByLabelText('description preview', { selector: 'input' })
    ).toHaveValue(
      'template1 with inputs adv plain hidden="Default val" adv plain select="" adv resource select="" adv search="" adv date="" plain hidden="Default val"'
    );
  });

  it('renders advanced fields step with expected form fields', async () => {
    renderJobWizard();
    await goToAdvancedStep();

    expect(
      screen.getByLabelText('adv plain hidden', { selector: 'textarea' })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('adv plain select toggle')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('adv resource select toggle')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('ssh user', { selector: 'input' })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('effective user', { selector: 'input' })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('description preview', { selector: 'input' })
    ).toBeInTheDocument();
  });

  it('updates description preview when editing the description template', async () => {
    renderJobWizard({ withGql: false });
    await goToAdvancedStep();

    const textField = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    await typeIntoField(textField, 'test command');

    const descriptionValue = 'Run %{adv plain hidden} %{wrong command name}';

    await act(async () => {
      await userEvent.click(
        screen.getByText('Edit job description template'),
        {},
        clickOptions
      );
    });

    const editText = screen.getByLabelText('description edit', {
      selector: 'input',
    });
    await typeIntoField(editText, descriptionValue);
    await act(async () => {
      await userEvent.click(
        screen.getByText('Preview job description'),
        {},
        clickOptions
      );
    });

    expect(
      screen.getByLabelText('description preview', { selector: 'input' })
    ).toHaveValue('Run test command %{wrong command name}');
  });

  it('shows template name in description preview when template has no inputs', async () => {
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
      } else if (action.key === 'HOST_IDS') {
        handleSuccess &&
          handleSuccess({
            data: { results: [{ name: 'host1' }, { name: 'host3' }] },
          });
      }
      return { type: 'get', ...action };
    });

    renderJobWizard({ withGql: false });
    await goToAdvancedStep();

    expect(
      screen.getByLabelText('description preview', { selector: 'input' })
    ).toHaveValue('template1');

    selectors.selectTemplateInputs.mockRestore();
    selectors.selectAdvancedTemplateInputs.mockRestore();
    api.get.mockRestore();
  });

  it('uses description_format for description preview', async () => {
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
                ...jobTemplateResponse.job_template,
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
      } else if (action.key === 'HOST_IDS') {
        handleSuccess &&
          handleSuccess({
            data: { results: [{ name: 'host1' }, { name: 'host3' }] },
          });
      }
      return { type: 'get', ...action };
    });

    renderJobWizard({ withGql: false });
    await goToAdvancedStep();

    expect(
      screen.getByLabelText('description preview', { selector: 'input' })
    ).toHaveValue('Run Default val');

    selectors.selectTemplateInputs.mockRestore();
    api.get.mockRestore();
  });

  it('dispatches resource search when typing in resource select', async () => {
    const newStore = testSetup(selectors, api);
    mockApi(api);

    renderJobWizard({ customStore: newStore, withGql: false });
    await goToAdvancedStep();

    const resourceSelectField = screen.getByLabelText(
      'adv resource select typeahead input'
    );

    await typeIntoField(resourceSelectField, 'some search');
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    const actions = newStore.getActions();
    const resourceSearchAction = actions.filter(
      action => action.key === 'ForemanTasksTask'
    );
    expect(resourceSearchAction).toHaveLength(2);
    expect(String(resourceSearchAction[1].url)).toContain('name=some+search');
  });
});
