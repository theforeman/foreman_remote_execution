import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../JobWizard';
import * as selectors from '../JobWizardSelectors';
import { WIZARD_TITLES } from '../JobWizardConstants';
import {
  testSetup,
  mockApi,
  jobCategories,
  jobTemplateResponse as jobTemplate,
  gqlMock,
} from './fixtures';

const store = testSetup(selectors, api);

const renderJobWizard = ({ withGql = false } = {}) => {
  const wizard = (
    <Provider store={store}>
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

const getWizardNavigation = () =>
  screen.getByRole('navigation', { name: 'Run Job steps' });

const getWizardStep = stepName =>
  within(getWizardNavigation()).getByRole('button', { name: stepName });

const getDisabledWizardSteps = () =>
  within(getWizardNavigation())
    .getAllByRole('button')
    .filter(button => button.getAttribute('aria-disabled') === 'true');

const expectDispatchedGet = expected => {
  expect(store.getActions()).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'get', ...expected })])
  );
};

describe('Job wizard fill', () => {
  beforeEach(() => {
    store.clearActions();
    jest.spyOn(selectors, 'selectRouterSearch');
    selectors.selectRouterSearch.mockImplementation(() => ({
      'host_ids[]': ['105', '37'],
    }));
  });

  afterEach(() => {
    selectors.selectRouterSearch.mockRestore();
  });

  it('selects a template and enables wizard steps', async () => {
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
            data: jobTemplate,
          });
      } else if (action.key === 'HOST_IDS') {
        handleSuccess &&
          handleSuccess({
            data: { results: [{ name: 'host1' }, { name: 'host3' }] },
          });
      }

      return { type: 'get', ...action };
    });
    selectors.selectJobTemplate.mockRestore();
    jest.spyOn(selectors, 'selectJobTemplate');
    selectors.selectJobTemplate.mockImplementation(() => ({}));

    renderJobWizard();

    expect(getDisabledWizardSteps()).toHaveLength(5);
    expect(getWizardStep(WIZARD_TITLES.categoryAndTemplate)).toBeInTheDocument();

    expectDispatchedGet({
      key: 'JOB_CATEGORIES',
      url: '/ui_job_wizard/categories',
    });
    expectDispatchedGet({
      key: 'HOST_IDS',
      params: { search: 'id = 105 or id = 37' },
      url: '/api/hosts',
    });
    expectDispatchedGet({
      key: 'JOB_TEMPLATES',
    });

    selectors.selectJobCategoriesStatus.mockImplementation(() => 'RESOLVED');
    selectors.selectJobTemplate.mockRestore();
    jest.spyOn(selectors, 'selectJobTemplate');
    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);

    await userEvent.click(
      screen.getByRole('button', { name: 'Job template toggle' })
    );
    await userEvent.click(screen.getByText(jobTemplate.job_template.name));

    expect(store.getActions().at(-1)).toEqual(
      expect.objectContaining({
        key: 'JOB_TEMPLATE',
        type: 'get',
        url: '/ui_job_wizard/template/178',
      })
    );

    await waitFor(() => {
      expect(getDisabledWizardSteps()).toHaveLength(0);
    });
  });

  it('renders all wizard steps and navigates between them', async () => {
    selectors.selectJobCategoriesStatus.mockImplementation(() => null);
    selectors.selectJobTemplates.mockRestore();
    selectors.selectJobCategories.mockRestore();
    mockApi(api);

    renderJobWizard({ withGql: true });

    const steps = [
      WIZARD_TITLES.hostsAndInputs,
      WIZARD_TITLES.categoryAndTemplate,
      WIZARD_TITLES.advanced,
      WIZARD_TITLES.review,
    ];

    for (const step of steps) {
      expect(screen.getAllByText(step)).toHaveLength(1);

      await userEvent.click(getWizardStep(step));

      expect(screen.getAllByText(step)).toHaveLength(3);
    }

    expect(screen.getAllByText(WIZARD_TITLES.typeOfExecution)).toHaveLength(1);
    expect(
      screen.queryByText('Select the type of execution')
    ).not.toBeInTheDocument();

    await userEvent.click(getWizardStep(WIZARD_TITLES.typeOfExecution));

    expect(
      screen.getByText('Select the type of execution')
    ).toBeInTheDocument();
  });
});
