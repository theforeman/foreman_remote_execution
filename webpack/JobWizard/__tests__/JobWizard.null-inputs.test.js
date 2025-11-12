import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../JobWizard';
import * as selectors from '../JobWizardSelectors';
import { testSetup, gqlMock } from './fixtures';

const store = testSetup(selectors, api);

describe('JobWizard null input handling', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'selectRouterSearch');
    selectors.selectRouterSearch.mockImplementation(() => ({}));

    jest.spyOn(selectors, 'selectJobCategoriesStatus');
    selectors.selectJobCategoriesStatus.mockImplementation(() => 'RESOLVED');

    jest.spyOn(selectors, 'selectJobTemplate');
    jest.spyOn(selectors, 'selectJobCategoriesResponse');
    jest.spyOn(selectors, 'selectTemplateError');
    jest.spyOn(selectors, 'selectIsSubmitting');
    jest.spyOn(selectors, 'selectIsLoading');

    selectors.selectTemplateError.mockImplementation(() => false);
    selectors.selectIsSubmitting.mockImplementation(() => false);
    selectors.selectIsLoading.mockImplementation(() => false);
    selectors.selectJobCategoriesResponse.mockImplementation(() => ({
      default_template: 1,
      default_category: 'Test Category'
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handles null inputs in template_inputs array gracefully', () => {
    const templateResponseWithNullInputs = {
      job_template: {
        name: 'Test Template',
        execution_timeout_interval: 60,
        time_to_pickup: 30,
        description_format: 'Test %{input1}',
        job_category: 'Test Category',
      },
      template_inputs: [
        { name: 'valid_input', default: 'test' },
        null, // This should be handled gracefully
        { name: 'another_valid_input', default: 'test2' },
        undefined, // This should also be handled gracefully
      ],
      advanced_template_inputs: [],
      effective_user: { value: 'root' },
      randomized_ordering: false,
      ssh_user: 'test',
      concurrency_control: { level: 1 },
    };

    selectors.selectJobTemplate.mockImplementation(() => templateResponseWithNullInputs);

    api.get.mockImplementation(({ handleSuccess, ...action }) => {
      if (action.key === 'JOB_TEMPLATE') {
        handleSuccess && handleSuccess({ data: templateResponseWithNullInputs });
      }
      return { type: 'get', ...action };
    });

    // This should not throw an error despite null inputs
    expect(() => {
      render(
        <MockedProvider mocks={gqlMock} addTypename={false}>
          <Provider store={store}>
            <JobWizard />
          </Provider>
        </MockedProvider>
      );
    }).not.toThrow();
  });

  test('handles null inputs in advanced_template_inputs array gracefully', () => {
    const templateResponseWithNullAdvancedInputs = {
      job_template: {
        name: 'Test Template',
        execution_timeout_interval: 60,
        time_to_pickup: 30,
        description_format: 'Test %{input1}',
        job_category: 'Test Category',
      },
      template_inputs: [
        { name: 'valid_input', default: 'test' },
      ],
      advanced_template_inputs: [
        { name: 'valid_advanced_input', default: 'test' },
        null, // This should be handled gracefully
        { name: 'another_valid_advanced_input', default: 'test2' },
        undefined, // This should also be handled gracefully
      ],
      effective_user: { value: 'root' },
      randomized_ordering: false,
      ssh_user: 'test',
      concurrency_control: { level: 1 },
    };

    selectors.selectJobTemplate.mockImplementation(() => templateResponseWithNullAdvancedInputs);

    api.get.mockImplementation(({ handleSuccess, ...action }) => {
      if (action.key === 'JOB_TEMPLATE') {
        handleSuccess && handleSuccess({ data: templateResponseWithNullAdvancedInputs });
      }
      return { type: 'get', ...action };
    });

    // This should not throw an error despite null advanced inputs
    expect(() => {
      render(
        <MockedProvider mocks={gqlMock} addTypename={false}>
          <Provider store={store}>
            <JobWizard />
          </Provider>
        </MockedProvider>
      );
    }).not.toThrow();
  });

  test('handles null schedule value gracefully', () => {
    const templateResponse = {
      job_template: {
        name: 'Test Template',
        execution_timeout_interval: 60,
        time_to_pickup: 30,
        description_format: 'Test template',
        job_category: 'Test Category',
      },
      template_inputs: [],
      advanced_template_inputs: [],
      effective_user: { value: 'root' },
      randomized_ordering: false,
      ssh_user: 'test',
      concurrency_control: { level: 1 },
    };

    selectors.selectJobTemplate.mockImplementation(() => templateResponse);

    api.get.mockImplementation(({ handleSuccess, ...action }) => {
      if (action.key === 'JOB_TEMPLATE') {
        handleSuccess && handleSuccess({ data: templateResponse });
      }
      return { type: 'get', ...action };
    });

    // Test with rerunData that might have null scheduleValue
    const rerunDataWithNullSchedule = {
      job_category: 'Test Category',
      template_invocations: [{ template_id: 1, effective_user: 'root' }],
      targeting: { search_query: 'name ~ test' },
      schedule: null, // This should be handled gracefully
    };

    expect(() => {
      render(
        <MockedProvider mocks={gqlMock} addTypename={false}>
          <Provider store={store}>
            <JobWizard rerunData={rerunDataWithNullSchedule} />
          </Provider>
        </MockedProvider>
      );
    }).not.toThrow();
  });
});