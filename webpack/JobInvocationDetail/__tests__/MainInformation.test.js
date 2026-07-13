/* eslint-disable max-lines */
import React from 'react';
import { fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { rtlHelpers } from 'foremanReact/common/testHelpers';
import { STATUS } from 'foremanReact/constants';
import { foremanUrl } from 'foremanReact/common/helpers';
import { usePermissions } from 'foremanReact/common/hooks/Permissions/permissionHooks';
import * as api from 'foremanReact/redux/API';
import { APIActions } from 'foremanReact/redux/API';
import JobInvocationDetailPage from '../index';
import {
  jobInvocationData,
  jobInvocationDataScheduled,
  jobInvocationDataRecurring,
  mockReportTemplatesResponse,
  mockReportTemplateInputsResponse,
} from './fixtures';
import {
  cancelJob,
  enableRecurringLogic,
  cancelRecurringLogic,
} from '../JobInvocationActions';
import { createForemanContextWrapper } from './foremanTestHelpers';
import {
  CANCEL_JOB,
  CANCEL_RECURRING_LOGIC,
  CHANGE_ENABLED_RECURRING_LOGIC,
  GET_REPORT_TEMPLATES,
  GET_REPORT_TEMPLATE_INPUTS,
  GET_TASK,
  JOB_INVOCATION_KEY,
} from '../JobInvocationConstants';

const { renderWithStore } = rtlHelpers;

jest.mock('foremanReact/redux/API/APISelectors', () =>
  jest.requireActual('foremanReact/redux/API/APISelectors')
);

jest.mock('foremanReact/common/hooks/Permissions/permissionHooks');
jest.mock('../JobInvocationActions', () => {
  const actual = jest.requireActual('../JobInvocationActions');

  return {
    ...actual,
    getJobInvocation: jest.fn(() => () => undefined),
    getTask: jest.fn(() => () => undefined),
  };
});

jest.spyOn(api, 'get');
jest.spyOn(APIActions, 'post');
jest.spyOn(APIActions, 'put');

usePermissions.mockReturnValue(true);

// Mock toLocaleString to always use UTC timezone for consistent test results
const originalToLocaleString = Date.prototype.toLocaleString;
beforeAll(() => {
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleString = function toLocaleStringUTC(locale, options) {
    return originalToLocaleString.call(this, locale, {
      ...options,
      timeZone: 'UTC',
    });
  };
});
afterAll(() => {
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleString = originalToLocaleString;
});

jest.mock('foremanReact/routes/common/PageLayout/PageLayout', () =>
  jest.fn(props => (
    <div>
      {props.header && <h1>{props.header}</h1>}
      {props.toolbarButtons && <div>{props.toolbarButtons}</div>}
      {props.children}
    </div>
  ))
);

const setupApiMocks = () => {
  api.get.mockImplementation(({ handleSuccess, key, ...action }) => {
    if (key === GET_REPORT_TEMPLATES) {
      if (handleSuccess) {
        handleSuccess({
          data: mockReportTemplatesResponse,
        });
      }
    } else if (key === GET_REPORT_TEMPLATE_INPUTS) {
      if (handleSuccess) {
        handleSuccess({
          data: mockReportTemplateInputsResponse,
        });
      }
    }

    return { type: 'get', key, ...action };
  });
  APIActions.post.mockImplementation(payload => ({ type: 'post', ...payload }));
  APIActions.put.mockImplementation(payload => ({ type: 'put', ...payload }));
};

const createJobInvocationDetailState = ({
  jobInvocation = jobInvocationData,
  jobInvocationStatus = STATUS.RESOLVED,
  jobInvocationError = null,
  includeTaskState = true,
} = {}) => {
  const jobInvocationResponse =
    jobInvocationError || JSON.parse(JSON.stringify(jobInvocation));

  return {
    API: {
      [JOB_INVOCATION_KEY]: jobInvocationError
        ? {
            response: jobInvocationResponse,
            status: STATUS.ERROR,
          }
        : {
            response: jobInvocationResponse,
            status: jobInvocationStatus,
          },
      ...(includeTaskState && {
        [GET_TASK]: {
          response: {
            available_actions: { cancellable: true },
            ...(jobInvocationResponse.task || {}),
          },
          status: STATUS.RESOLVED,
        },
      }),
    },
  };
};

jest.mock('../JobInvocationHostTable.js', () => () => (
  <div data-testid="mock-table">Mock Table</div>
));

const reportTemplateJobId = mockReportTemplatesResponse.results[0].id;

const defaultHistory = { push: jest.fn() };

const renderJobInvocationDetailPage = (
  initialState,
  { jobId, history = defaultHistory } = {}
) => {
  const id =
    jobId ?? initialState.API?.[JOB_INVOCATION_KEY]?.response?.id ?? '1';

  return renderWithStore(
    <JobInvocationDetailPage
      match={{ params: { id: `${id}` } }}
      history={history}
    />,
    initialState,
    undefined
  );
};

describe('JobInvocationDetailPage', () => {
  beforeEach(() => {
    setupApiMocks();
    usePermissions.mockReturnValue(true);

    const { getJobInvocation, getTask } = jest.requireMock(
      '../JobInvocationActions'
    );
    getJobInvocation.mockImplementation(() => () => undefined);
    getTask.mockImplementation(() => () => undefined);
  });

  afterEach(() => {
    api.get.mockClear();
    APIActions.post.mockClear();
    APIActions.put.mockClear();
  });

  it('shows scheduled date', async () => {
    const scheduledJobInvocation = JSON.parse(
      JSON.stringify(jobInvocationDataScheduled)
    );

    renderJobInvocationDetailPage(
      createJobInvocationDetailState({
        jobInvocation: scheduledJobInvocation,
        includeTaskState: false,
      }),
      { jobId: jobInvocationDataScheduled.id }
    );

    expect(screen.getByText('Scheduled at:')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 3000, 11:34 UTC')).toBeInTheDocument();
    expect(screen.getByText('Not yet')).toBeInTheDocument();
  });

  it('renders main information', async () => {
    const jobId = jobInvocationData.id;

    const { container } = renderJobInvocationDetailPage(
      createJobInvocationDetailState()
    );

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(container.querySelector('.chart-donut')).toBeInTheDocument();
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
    ).toEqual(`/legacy/job_invocations/${jobId}`);
  });

  it('keeps toolbar buttons mounted while job invocation data is refreshing', async () => {
    renderJobInvocationDetailPage(
      createJobInvocationDetailState({
        jobInvocationStatus: STATUS.PENDING,
      })
    );

    expect(screen.getByText('Create report')).toBeInTheDocument();
    expect(screen.getByText('Rerun all')).toBeInTheDocument();
  });

  it('disables Create report when the job task state is running', async () => {
    usePermissions.mockImplementation(requiredPermissions =>
      requiredPermissions.includes('generate_report_templates')
    );

    renderJobInvocationDetailPage(
      createJobInvocationDetailState({
        jobInvocation: {
          ...jobInvocationData,
          task: { ...jobInvocationData.task, state: 'running' },
        },
      })
    );

    const createReportButton = screen.getByRole('link', {
      name: 'Create report',
    });

    expect(createReportButton).toHaveAttribute('aria-disabled', 'true');
    expect(createReportButton).toHaveClass('pf-m-disabled');
  });

  it('should dispatch global actions', async () => {
    const actualActions = jest.requireActual('../JobInvocationActions');
    const { getTask } = jest.requireMock('../JobInvocationActions');

    getTask.mockImplementation(taskId => dispatch =>
      actualActions.getTask(taskId)(dispatch)
    );

    const jobId = jobInvocationDataRecurring.id;
    const taskId = jobInvocationDataRecurring.task.id;
    const recurrenceId = jobInvocationDataRecurring.recurrence.id;

    const { store } = renderJobInvocationDetailPage(
      createJobInvocationDetailState({
        jobInvocation: jobInvocationDataRecurring,
      }),
      { jobId }
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.objectContaining({
        key: GET_REPORT_TEMPLATES,
        url: '/api/report_templates',
      })
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.objectContaining({
        key: GET_TASK,
        url: `/foreman_tasks/api/tasks/${taskId}`,
      })
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.objectContaining({
        key: GET_REPORT_TEMPLATE_INPUTS,
        url: `/api/templates/${reportTemplateJobId}/template_inputs`,
      })
    );

    api.get.mockClear();
    APIActions.post.mockClear();
    APIActions.put.mockClear();

    store.dispatch(cancelJob(jobId, false));
    store.dispatch(cancelJob(jobId, true));
    store.dispatch(enableRecurringLogic(recurrenceId, true, jobId));
    store.dispatch(enableRecurringLogic(recurrenceId, false, jobId));
    store.dispatch(cancelRecurringLogic(recurrenceId, jobId));

    expect(APIActions.post).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        key: CANCEL_JOB,
        url: `/job_invocations/${jobId}/cancel`,
      })
    );
    expect(APIActions.post).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        key: CANCEL_JOB,
        url: `/job_invocations/${jobId}/cancel?force=true`,
      })
    );
    expect(APIActions.put).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        key: CHANGE_ENABLED_RECURRING_LOGIC,
        url: `/foreman_tasks/api/recurring_logics/${recurrenceId}`,
      })
    );
    expect(APIActions.put).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        key: CHANGE_ENABLED_RECURRING_LOGIC,
        url: `/foreman_tasks/api/recurring_logics/${recurrenceId}`,
      })
    );
    expect(APIActions.post).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        key: CANCEL_RECURRING_LOGIC,
        url: `/foreman_tasks/recurring_logics/${recurrenceId}/cancel`,
      })
    );
  });

  it('renders empty state when the job invocation fails to load', () => {
    const jobId = '99';
    const errorMessage = 'Record not found';
    const history = createMemoryHistory();
    const ForemanContextWrapper = createForemanContextWrapper();

    renderWithStore(
      <Router history={history}>
        <ForemanContextWrapper>
          <JobInvocationDetailPage
            match={{ params: { id: jobId } }}
            history={history}
          />
        </ForemanContextWrapper>
      </Router>,
      createJobInvocationDetailState({
        jobInvocationError: {
          message: errorMessage,
          response: { status: 404 },
        },
      }),
      undefined
    );

    expect(
      screen.getByRole('heading', {
        name: 'Unable to load job invocation',
        level: 5,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element.textContent?.includes(
            `The job invocation with id ${jobId} could not be found. It may have been deleted or may not be available in your current organization or location scope.`
          )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Server returned: ${errorMessage}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to job invocations' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create a new job invocation' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-table')).not.toBeInTheDocument();
  });
});
