import React from 'react';
import { Provider } from 'react-redux';
import { mount } from '@theforeman/test';
import { render, fireEvent, screen, act } from '@testing-library/react';
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

describe('Job wizard fill', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'selectRouterSearch');
    selectors.selectRouterSearch.mockImplementation(() => ({
      'host_ids[]': ['105', '37'],
    }));
  });
  afterEach(() => {
    selectors.selectRouterSearch.mockRestore();
  });
  it('should select template', async () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      5
    );
    selectors.selectJobCategoriesStatus.mockImplementation(() => 'RESOLVED');
    expect(store.getActions()).toMatchSnapshot('initial');
    selectors.selectJobTemplate.mockRestore();
    jest.spyOn(selectors, 'selectJobTemplate');
    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);
    wrapper.find('.pf-c-button.pf-c-select__toggle-button').simulate('click');
    await act(async () => {
      await wrapper
        .find('.pf-c-select__menu-item')
        .first()
        .simulate('click');
    });
    expect(store.getActions().slice(-1)).toMatchSnapshot('select template');
    wrapper.update();
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      0
    );
  });

  it('have all steps', async () => {
    selectors.selectJobCategoriesStatus.mockImplementation(() => null);
    selectors.selectJobTemplates.mockRestore();
    selectors.selectJobCategories.mockRestore();
    mockApi(api);

    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    const steps = [
      WIZARD_TITLES.hostsAndInputs,
      WIZARD_TITLES.categoryAndTemplate,
      WIZARD_TITLES.advanced,
      WIZARD_TITLES.review,
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
    const step = WIZARD_TITLES.typeOfExecution;
    const stepTitle = screen.getAllByText(step);
    expect(stepTitle).toHaveLength(1);
    expect(screen.queryAllByText('Select the type of execution')).toHaveLength(
      0
    );
    await act(async () => {
      await fireEvent.click(stepTitle[0]);
    });
    expect(screen.getAllByText('Select the type of execution')).toHaveLength(1);
  });
});
