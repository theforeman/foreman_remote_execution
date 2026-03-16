import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as api from 'foremanReact/redux/API';
import * as selectors from '../JobInvocationSelectors';
import { TemplateInvocation } from '../TemplateInvocation';
import { mockTemplateInvocationResponse } from './fixtures';

jest.spyOn(api, 'get');
jest.mock('../JobInvocationSelectors');
jest.mock('foremanReact/components/ToastsList', () => ({
  addToast: jest.fn(payload => ({ type: 'ADD_TOAST', payload })),
}));

const mockStore = configureMockStore([]);
const store = mockStore({
  HOSTS_API: {
    response: {
      subtotal: 3,
    },
  },
});

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

const mockProps = {
  hostID: '1',
  jobID: '1',
  isInTableView: false,
  isExpanded: true,
  hostName: 'example-host',
  hostProxy: { name: 'example-proxy', href: '#' },
  showOutputType: { stderr: true, stdout: true, debug: true },
  setShowOutputType: jest.fn(),
  showTemplatePreview: false,
  setShowTemplatePreview: jest.fn(),
  showCommand: false,
  setShowCommand: jest.fn(),
};

describe('TemplateInvocation', () => {
  beforeEach(() => {
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'RESOLVED'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      mockTemplateInvocationResponse
    );
  });

  test('render', () => {
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(screen.getByText('example-host')).toBeInTheDocument();
    expect(screen.getByText('example-proxy')).toBeInTheDocument();
    expect(screen.getByText(/using Smart Proxy/)).toBeInTheDocument();
    expect(screen.getByText(/Target:/)).toBeInTheDocument();
    expect(screen.getByText('This is red text')).toBeInTheDocument();
    expect(screen.getByText('This is default text')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy to clipboard')).toBeInTheDocument();
  });

  test('shows "No output" message when all toggles are off', () => {
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(
      screen.queryByText('No output for the selected filters')
    ).not.toBeInTheDocument();

    const newProps = {
      ...mockProps,
      showOutputType: { stderr: false, stdout: false, debug: false },
    };

    rerender(
      <Provider store={store}>
        <TemplateInvocation {...newProps} />
      </Provider>
    );

    expect(
      screen.getByText('No output for the selected filters')
    ).toBeInTheDocument();
  });

  test('correctly filters specific output types', () => {
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(screen.getByText('Exit status: 1')).toBeInTheDocument(); // stdout
    expect(
      screen.getByText('StandardError: Job execution failed')
    ).toBeInTheDocument(); // debug

    // Turn off stdout
    rerender(
      <Provider store={store}>
        <TemplateInvocation
          {...mockProps}
          showOutputType={{ stderr: true, stdout: false, debug: true }}
        />
      </Provider>
    );
    expect(screen.queryByText('Exit status: 1')).not.toBeInTheDocument();
    expect(
      screen.getByText('StandardError: Job execution failed')
    ).toBeInTheDocument();

    // Turn off debug
    rerender(
      <Provider store={store}>
        <TemplateInvocation
          {...mockProps}
          showOutputType={{ stderr: true, stdout: false, debug: false }}
        />
      </Provider>
    );
    expect(screen.queryByText('Exit status: 1')).not.toBeInTheDocument();
    expect(
      screen.queryByText('StandardError: Job execution failed')
    ).not.toBeInTheDocument();
  });

  test('displays an error alert when there is an error', async () => {
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'ERROR'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () => ({
      response: { data: { error: 'Error message' } },
    }));
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(
      screen.getByText(
        'An error occurred while fetching the template invocation details.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('displays a skeleton while loading', async () => {
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'PENDING'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () => null);
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('template-invocation-skeleton')
    ).toBeInTheDocument();
  });

  test('copies text to clipboard when clicked', async () => {
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    const copyButton = screen.getByLabelText('Copy to clipboard');
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText('Successfully copied to clipboard!')
    ).toBeInTheDocument();
  });

  describe('Cancel/Abort task buttons', () => {
    const responseWithCancellableTask = {
      ...mockTemplateInvocationResponse,
      task: { id: 'task-123', cancellable: true },
      permissions: {
        view_foreman_tasks: true,
        cancel_job_invocations: true,
        execute_jobs: true,
      },
    };

    beforeEach(() => {
      selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
        'RESOLVED'
      );
      selectors.selectTemplateInvocation.mockImplementation(() => () =>
        responseWithCancellableTask
      );
      jest.spyOn(api.APIActions, 'post').mockReturnValue({ type: 'MOCK_POST' });
    });

    test('Cancel Task calls the cancel endpoint with force=false', () => {
      render(
        <Provider store={store}>
          <TemplateInvocation {...mockProps} />
        </Provider>
      );
      fireEvent.click(screen.getByText('Cancel Task'));

      const postCall = api.APIActions.post.mock.calls.find(
        call => call[0].key === 'CANCEL_TASK'
      )?.[0];
      expect(postCall.url).toBe(
        `/api/v2/job_invocations/${mockProps.jobID}/cancel`
      );
      expect(postCall.params).toEqual({
        search: `id ^ (${mockProps.hostID})`,
        force: false,
      });
      expect(postCall.key).toBe('CANCEL_TASK');
    });

    test('Abort Task calls the cancel endpoint with force=true', () => {
      render(
        <Provider store={store}>
          <TemplateInvocation {...mockProps} />
        </Provider>
      );
      fireEvent.click(screen.getByText('Abort Task'));

      const postCall = api.APIActions.post.mock.calls.find(
        call => call[0].key === 'ABORT_TASK'
      )?.[0];
      expect(postCall.url).toBe(
        `/api/v2/job_invocations/${mockProps.jobID}/cancel`
      );
      expect(postCall.params).toEqual({
        search: `id ^ (${mockProps.hostID})`,
        force: true,
      });
    });

    test('Cancel Task dispatches success toast when task was cancelled', () => {
      const testStore = configureMockStore([])({});
      jest
        .spyOn(api.APIActions, 'post')
        .mockImplementation(({ handleSuccess }) => {
          handleSuccess({ data: { cancelled: ['task-123'], skipped: [] } });
          return { type: 'MOCK_POST' };
        });

      render(
        <Provider store={testStore}>
          <TemplateInvocation {...mockProps} />
        </Provider>
      );
      fireEvent.click(screen.getByText('Cancel Task'));

      const actions = testStore.getActions();
      const resultToast = actions.find(
        a => a?.payload?.key === 'cancel-job-result'
      );
      expect(resultToast?.payload?.type).toBe('success');
    });

    test('Cancel Task dispatches warning toast when nothing was cancelled', () => {
      const testStore = configureMockStore([])({});
      jest
        .spyOn(api.APIActions, 'post')
        .mockImplementation(({ handleSuccess }) => {
          handleSuccess({ data: { cancelled: [], skipped: ['task-123'] } });
          return { type: 'MOCK_POST' };
        });

      render(
        <Provider store={testStore}>
          <TemplateInvocation {...mockProps} />
        </Provider>
      );
      fireEvent.click(screen.getByText('Cancel Task'));

      const actions = testStore.getActions();
      const resultToast = actions.find(
        a => a?.payload?.key === 'cancel-job-result'
      );
      expect(resultToast?.payload?.type).toBe('warning');
    });
  });
});
