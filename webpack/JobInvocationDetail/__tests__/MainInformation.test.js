import React from 'react';
import configureMockStore from 'redux-mock-store';
import { fireEvent, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { foremanUrl } from 'foremanReact/common/helpers';
import * as api from 'foremanReact/redux/API';
import JobInvocationDetailPage from '../index';
import {
  jobInvocationData,
  jobInvocationDataScheduled,
  jobInvocationDataRecurring,
  mockPermissionsData,
  mockReportTemplatesResponse,
  mockReportTemplateInputsResponse,
} from './fixtures';
import {
  cancelJob,
  enableRecurringLogic,
  cancelRecurringLogic,
} from '../JobInvocationActions';
import {
  CANCEL_JOB,
  CANCEL_RECURRING_LOGIC,
  CHANGE_ENABLED_RECURRING_LOGIC,
  GET_REPORT_TEMPLATES,
  GET_REPORT_TEMPLATE_INPUTS,
  JOB_INVOCATION_KEY,
} from '../JobInvocationConstants';

jest.spyOn(api, 'get');

jest.mock('foremanReact/common/hooks/API/APIHooks', () => ({
  useAPI: jest.fn(() => ({
    response: mockPermissionsData,
  })),
}));

jest.mock('foremanReact/routes/common/PageLayout/PageLayout', () =>
  jest.fn(props => (
    <div>
      {props.header && <h1>{props.header}</h1>}
      {props.toolbarButtons && <div>{props.toolbarButtons}</div>}
      {props.children}
    </div>
  ))
);

const initialState = {
  JOB_INVOCATION_KEY: {
    response: jobInvocationData,
  },
  GET_REPORT_TEMPLATES: mockReportTemplatesResponse,
};

const initialStateScheduled = {
  JOB_INVOCATION_KEY: {
    response: jobInvocationDataScheduled,
  },
};

api.get.mockImplementation(({ handleSuccess, ...action }) => {
  if (action.key === 'GET_REPORT_TEMPLATES') {
    handleSuccess &&
      handleSuccess({
        data: mockReportTemplatesResponse,
      });
  } else if (action.key === 'GET_REPORT_TEMPLATE_INPUTS') {
    handleSuccess &&
      handleSuccess({
        data: mockReportTemplateInputsResponse,
      });
  }

  return { type: 'get', ...action };
});

jest.mock('../JobInvocationHostTable.js', () => () => (
  <div data-testid="mock-table">Mock Table</div>
));

const reportTemplateJobId = mockReportTemplatesResponse.results[0].id;

const mockStore = configureMockStore([thunk]);

describe('JobInvocationDetailPage', () => {
  it('renders main information', async () => {
    const jobId = jobInvocationData.id;
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <JobInvocationDetailPage match={{ params: { id: `${jobId}` } }} />
      </Provider>
    );

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      container.querySelector('.chart-donut .pf-c-chart') // todo: change to pf5 once we update @patternfly/react-charts to v7
    ).toBeInTheDocument();
    expect(screen.getByText('2/6')).toBeInTheDocument();
    expect(screen.getByText('Systems')).toBeInTheDocument();
    expect(screen.getByText('System status')).toBeInTheDocument();
    expect(screen.getByText('Succeeded: 2')).toBeInTheDocument();
    expect(screen.getByText('Failed: 4')).toBeInTheDocument();
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument();
    expect(screen.getByText('Cancelled: 0')).toBeInTheDocument();

    const informationToCheck = {
      'Effective user:': jobInvocationData.effective_user,
      'Started at:': 'Jan 1, 2024, 11:34 UTC',
      'SSH user:': 'Not available',
      'Template:': jobInvocationData.template_name,
    };

    Object.entries(informationToCheck).forEach(([term, expectedText]) => {
      const termContainers = container.querySelectorAll(
        '.pf-v5-c-description-list__term .pf-v5-c-description-list__text'
      );
      termContainers.forEach(termContainer => {
        if (termContainer.textContent.includes(term)) {
          let descriptionContainer;
          if (term === 'SSH user:') {
            descriptionContainer = termContainer
              .closest('.pf-v5-c-description-list__group')
              .querySelector(
                '.pf-v5-c-description-list__description .pf-v5-c-description-list__text .disabled-text'
              );
          } else {
            descriptionContainer = termContainer
              .closest('.pf-v5-c-description-list__group')
              .querySelector(
                '.pf-v5-c-description-list__description .pf-v5-c-description-list__text'
              );
          }
          expect(descriptionContainer.textContent).toContain(expectedText);
        }
      });
    });

    // checks the global actions and if they link to the correct url
    expect(screen.getByText('Create report').getAttribute('href')).toEqual(
      foremanUrl(
        `/templates/report_templates/${mockReportTemplatesResponse.results[0].id}/generate?report_template_report%5Binput_values%5D%5B${mockReportTemplateInputsResponse.results[0].id}%5D%5Bvalue%5D=${jobId}`
      )
    );
    expect(screen.getByText('Rerun all').getAttribute('href')).toEqual(
      foremanUrl(`/job_invocations/${jobId}/rerun`)
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    });
    expect(
      screen
        .getByText('Rerun successful')
        .closest('a')
        .getAttribute('href')
    ).toEqual(foremanUrl(`/job_invocations/${jobId}/rerun?succeeded_only=1`));
    expect(
      screen
        .getByText('Rerun failed')
        .closest('a')
        .getAttribute('href')
    ).toEqual(foremanUrl(`/job_invocations/${jobId}/rerun?failed_only=1`));
    expect(
      screen
        .getByText('View task')
        .closest('a')
        .getAttribute('href')
    ).toEqual(foremanUrl(`/foreman_tasks/tasks/${jobInvocationData.task.id}`));
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Abort')).toBeInTheDocument();
    expect(screen.queryByText('Enable recurring')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel recurring')).not.toBeInTheDocument();
    expect(
      screen
        .getByText('Legacy UI')
        .closest('a')
        .getAttribute('href')
    ).toEqual(`/job_invocations/${jobId}`);
  });

  it('shows scheduled date', async () => {
    const store = mockStore(initialStateScheduled);
    render(
      <Provider store={store}>
        <JobInvocationDetailPage
          match={{ params: { id: `${jobInvocationDataScheduled.id}` } }}
        />
      </Provider>
    );

    expect(screen.getByText('Scheduled at:')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 3000, 11:34 UTC')).toBeInTheDocument();
    expect(screen.getByText('Not yet')).toBeInTheDocument();
  });

  it('should dispatch global actions', async () => {
    // recurring in the future
    const jobId = jobInvocationDataRecurring.id;
    const recurrenceId = jobInvocationDataRecurring.recurrence.id;
    const store = mockStore(jobInvocationDataRecurring);
    render(
      <Provider store={store}>
        <JobInvocationDetailPage match={{ params: { id: `${jobId}` } }} />
      </Provider>
    );

    const expectedActions = [
      { key: GET_REPORT_TEMPLATES, url: '/api/report_templates' },
      {
        key: JOB_INVOCATION_KEY,
        url: `/api/job_invocations/${jobId}?host_status=true`,
      },
      {
        key: GET_REPORT_TEMPLATE_INPUTS,
        url: `/api/templates/${reportTemplateJobId}/template_inputs`,
      },
      {
        key: CANCEL_JOB,
        url: `/job_invocations/${jobId}/cancel`,
      },
      {
        key: CANCEL_JOB,
        url: `/job_invocations/${jobId}/cancel?force=true`,
      },
      {
        key: CHANGE_ENABLED_RECURRING_LOGIC,
        url: `/foreman_tasks/api/recurring_logics/${recurrenceId}`,
      },
      {
        key: CHANGE_ENABLED_RECURRING_LOGIC,
        url: `/foreman_tasks/api/recurring_logics/${recurrenceId}`,
      },
      {
        key: CANCEL_RECURRING_LOGIC,
        url: `/foreman_tasks/recurring_logics/${recurrenceId}/cancel`,
      },
    ];

    store.dispatch(cancelJob(jobId, false));
    store.dispatch(cancelJob(jobId, true));
    store.dispatch(enableRecurringLogic(recurrenceId, true, jobId));
    store.dispatch(enableRecurringLogic(recurrenceId, false, jobId));
    store.dispatch(cancelRecurringLogic(recurrenceId, jobId));

    const actualActions = store.getActions();
    expect(actualActions).toHaveLength(expectedActions.length);

    expectedActions.forEach((expectedAction, index) => {
      if (actualActions[index].type === 'WITH_INTERVAL') {
        expect(actualActions[index].key.key).toEqual(expectedAction.key);
        expect(actualActions[index].key.url).toEqual(expectedAction.url);
      } else {
        expect(actualActions[index].key).toEqual(expectedAction.key);
        if (expectedAction.url) {
          expect(actualActions[index].url).toEqual(expectedAction.url);
        }
      }
    });
  });
});
