import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

  describe('Cancel/Abort task buttons API calls', () => {
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

    test('clicking the `Cancel Task` button calls API with cancel param', () => {
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
        `/foreman_tasks/tasks/${responseWithCancellableTask.task.id}/cancel`
      );
      expect(postCall.key).toBe('CANCEL_TASK');
    });

    test('clicking the `Abort Task` button calls API with abort param', () => {
      render(
        <Provider store={store}>
          <TemplateInvocation {...mockProps} />
        </Provider>
      );
      fireEvent.click(screen.getByText('Abort task'));

      const postCall = api.APIActions.post.mock.calls.find(
        call => call[0].key === 'ABORT_TASK'
      )?.[0];
      expect(postCall.url).toBe(
        `/foreman_tasks/tasks/${responseWithCancellableTask.task.id}/abort`
      );
      expect(postCall.key).toBe('ABORT_TASK');
    });
  });
});

describe('TemplateInvocation polling', () => {
  const noop = () => {};
  const reducer = (state = {}) => state;
  const makeStore = () => createStore(reducer, applyMiddleware(thunk));

  const pollingProps = {
    hostID: '1',
    jobID: '1',
    isInTableView: false,
    isExpanded: true,
    hostName: 'example-host',
    hostProxy: { name: 'example-proxy', href: '#' },
    showOutputType: { stderr: true, stdout: true, debug: true },
    setShowOutputType: noop,
    showTemplatePreview: false,
    setShowTemplatePreview: noop,
    showCommand: false,
    setShowCommand: noop,
  };

  let apiGetSpy;

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'RESOLVED'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      mockTemplateInvocationResponse
    );
    apiGetSpy = jest
      .spyOn(api.APIActions, 'get')
      .mockImplementation(({ handleSuccess }) => {
        handleSuccess &&
          handleSuccess({ data: { finished: false, auto_refresh: true } });
        return { type: 'MOCK_GET' };
      });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    apiGetSpy.mockRestore();
  });

  it('fetches on mount when isExpanded is true', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('does not fetch on mount when isExpanded is false', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    expect(apiGetSpy).not.toHaveBeenCalled();
  });

  it('schedules next poll via setTimeout when auto_refresh is true and not finished', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });

  it('does not schedule next poll when finished is true', () => {
    apiGetSpy.mockImplementation(({ handleSuccess }) => {
      handleSuccess && handleSuccess({ data: { finished: true, auto_refresh: true } });
      return { type: 'MOCK_GET' };
    });
    const store = makeStore();
    render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('does not schedule next poll when auto_refresh is false', () => {
    apiGetSpy.mockImplementation(({ handleSuccess }) => {
      handleSuccess && handleSuccess({ data: { finished: false, auto_refresh: false } });
      return { type: 'MOCK_GET' };
    });
    const store = makeStore();
    render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('clears the polling timeout and sets cancelled on unmount', () => {
    const store = makeStore();
    const { unmount } = render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    unmount();
    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('cancels in-flight callback when unmounted before handleSuccess runs', () => {
    let capturedHandleSuccess;
    apiGetSpy.mockImplementation(({ handleSuccess }) => {
      capturedHandleSuccess = handleSuccess;
      return { type: 'MOCK_GET' };
    });

    const store = makeStore();
    const { unmount } = render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      capturedHandleSuccess({ data: { finished: false, auto_refresh: true } });
      jest.advanceTimersByTime(5000);
    });

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('re-fetches when isExpanded changes from false to true', () => {
    const store = makeStore();
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    expect(apiGetSpy).not.toHaveBeenCalled();

    rerender(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('cancels existing poll and starts fresh when isExpanded changes', () => {
    const store = makeStore();
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={store}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });
});
