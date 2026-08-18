/* eslint-disable max-lines */
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { render, act, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line import/no-extraneous-dependencies
import API from 'foremanReact/API';
import { addToast } from 'foremanReact/components/ToastsList';
import * as api from 'foremanReact/redux/API';
import * as selectors from '../JobInvocationSelectors';
import { TemplateInvocation } from '../TemplateInvocation';
import {
  OUTPUT_MAX_REFRESH_INTERVAL_MS,
  OUTPUT_REFRESH_INTERVAL_MS,
} from '../JobInvocationConstants';
import {
  jobInvocationOutput,
  mockTemplateInvocationResponse,
} from './fixtures';

jest.mock('foremanReact/API');
jest.mock('../JobInvocationSelectors');

jest.mock('foremanReact/components/ToastsList', () => ({
  addToast: jest.fn(payload => ({ type: 'ADD_TOAST', payload })),
}));

const apiActionsGetSpy = jest.spyOn(api.APIActions, 'get');

describe('TemplateInvocation polling', () => {
  const noop = () => {};
  const reducer = (state = {}) => state;
  const makeStore = () => createStore(reducer, applyMiddleware(thunk));
  const outputURL = '/api/job_invocations/1/hosts/1';
  const detailsURL = '/show_template_invocation_by_host/1/job_invocation/1';

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
  const renderInvocation = (props = {}) =>
    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} {...props} />
      </Provider>
    );

  const respond = (request, overrides = {}) => {
    const data = {
      ...mockTemplateInvocationResponse,
      finished: false,
      auto_refresh: true,
      ...overrides.details,
    };
    if (request.handleSuccess) request.handleSuccess({ data });
    return { type: 'MOCK_GET' };
  };

  const outputResponse = (overrides = {}) =>
    Promise.resolve({ data: { output: [], refresh: true, ...overrides } });

  const flushPromises = () => act(async () => {});

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'RESOLVED'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      mockTemplateInvocationResponse
    );
    API.get.mockImplementation(() => outputResponse());
    apiActionsGetSpy.mockImplementation(request => respond(request));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
    API.get.mockReset();
    apiActionsGetSpy.mockReset();
    addToast.mockClear();
  });

  it('requests only output added since the latest displayed chunk', () => {
    renderInvocation();

    expect(API.get).toHaveBeenCalledWith(
      outputURL,
      expect.objectContaining({
        params: {
          since: jobInvocationOutput[jobInvocationOutput.length - 1].timestamp,
        },
      })
    );
  });

  it('uses newly appended output as the cursor for the next poll', async () => {
    const latestTimestamp = 1733931150.2044532;
    API.get.mockImplementation(() =>
      outputResponse({
        output: [
          {
            output_type: 'stdout',
            output: 'New live output\n',
            timestamp: latestTimestamp,
          },
        ],
      })
    );

    renderInvocation();
    await flushPromises();
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(API.get.mock.calls[1]).toEqual([
      outputURL,
      expect.objectContaining({
        params: { since: latestTimestamp },
      }),
    ]);
  });

  it('polls output once per output refresh interval', async () => {
    renderInvocation();
    expect(API.get).toHaveBeenCalledTimes(1);

    await flushPromises();
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(API.get).toHaveBeenCalledTimes(2);
    expect(API.get.mock.calls[1][0]).toBe(outputURL);
  });

  it('gradually backs off while the job produces no output', async () => {
    renderInvocation();
    await flushPromises();

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    expect(API.get).toHaveBeenCalledTimes(2);
    await flushPromises();

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    expect(API.get).toHaveBeenCalledTimes(2);
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    expect(API.get).toHaveBeenCalledTimes(3);
    await flushPromises();

    act(() =>
      jest.advanceTimersByTime(
        OUTPUT_MAX_REFRESH_INTERVAL_MS - OUTPUT_REFRESH_INTERVAL_MS
      )
    );
    expect(API.get).toHaveBeenCalledTimes(3);
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    expect(API.get).toHaveBeenCalledTimes(4);
  });

  it('returns to fast polling when new output arrives', async () => {
    let outputRequests = 0;
    API.get.mockImplementation(() => {
      outputRequests += 1;
      return outputResponse({
        output:
          outputRequests === 3
            ? [
                {
                  output_type: 'stdout',
                  output: 'New live output\n',
                  timestamp: 1733931150.2044532,
                },
              ]
            : [],
      });
    });

    renderInvocation();
    await flushPromises();

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    await flushPromises();
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS * 2));
    expect(API.get).toHaveBeenCalledTimes(3);
    await flushPromises();

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    expect(API.get).toHaveBeenCalledTimes(4);
  });

  it('appends new output without replacing the displayed output', async () => {
    API.get.mockImplementation(() =>
      outputResponse({
        output: [
          {
            output_type: 'stdout',
            output: 'New live output\n',
            timestamp: 1733931150.2044532,
          },
        ],
      })
    );

    renderInvocation();
    await flushPromises();

    expect(screen.getByText('This is red text')).toBeInTheDocument();
    expect(screen.getByText('New live output')).toBeInTheDocument();
  });

  it('does not replace live output with a later Redux update', async () => {
    let response = mockTemplateInvocationResponse;
    const localStore = makeStore();
    selectors.selectTemplateInvocation.mockImplementation(() => () => response);
    API.get.mockImplementation(() =>
      outputResponse({
        output: [
          {
            output_type: 'stdout',
            output: 'New live output\n',
            timestamp: 1733931150.2044532,
          },
        ],
      })
    );

    render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    await flushPromises();

    response = {
      ...mockTemplateInvocationResponse,
      output: [
        {
          output_type: 'stdout',
          output: 'Stale Redux output\n',
          timestamp: 1,
        },
      ],
    };
    act(() => {
      localStore.dispatch({ type: 'UPDATE' });
    });

    expect(screen.getByText('New live output')).toBeInTheDocument();
    expect(screen.queryByText('Stale Redux output')).not.toBeInTheDocument();
  });

  it('refreshes the complete details once after host output finishes', async () => {
    API.get.mockImplementation(() => outputResponse({ refresh: false }));
    apiActionsGetSpy.mockImplementation(request =>
      respond(request, { details: { finished: false, auto_refresh: true } })
    );

    renderInvocation();
    await flushPromises();

    expect(API.get).toHaveBeenCalledTimes(1);
    expect(API.get.mock.calls[0][0]).toBe(outputURL);
    expect(apiActionsGetSpy).toHaveBeenCalledTimes(1);
    expect(apiActionsGetSpy.mock.calls[0][0].url).toBe(detailsURL);

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS * 2));

    expect(API.get).toHaveBeenCalledTimes(1);
    expect(apiActionsGetSpy).toHaveBeenCalledTimes(1);
  });

  it('loads complete details first when no cached response exists', () => {
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      undefined
    );

    renderInvocation();

    expect(apiActionsGetSpy).toHaveBeenCalledTimes(1);
    expect(apiActionsGetSpy.mock.calls[0][0].url).toBe(detailsURL);

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(API.get).toHaveBeenCalledTimes(1);
    expect(API.get.mock.calls[0][0]).toBe(outputURL);
  });

  it('does not poll output when complete details disable auto refresh', () => {
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      undefined
    );
    apiActionsGetSpy.mockImplementation(request =>
      respond(request, { details: { auto_refresh: false } })
    );

    renderInvocation();

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS * 2));

    expect(apiActionsGetSpy).toHaveBeenCalledTimes(1);
    expect(apiActionsGetSpy.mock.calls[0][0].url).toBe(detailsURL);
    expect(API.get).not.toHaveBeenCalled();
  });

  it('retries failed output requests with backoff and one toast', async () => {
    API.get.mockRejectedValue({
      response: { data: { error: { message: 'Output request failed' } } },
    });

    renderInvocation();
    await flushPromises();

    expect(API.get).toHaveBeenCalledTimes(1);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'danger',
        message: 'Output request failed',
      })
    );

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    expect(API.get).toHaveBeenCalledTimes(2);
    await flushPromises();

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
    expect(API.get).toHaveBeenCalledTimes(2);
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(API.get).toHaveBeenCalledTimes(3);
    expect(addToast).toHaveBeenCalledTimes(1);
  });

  it('does not start output polling after a details request fails', () => {
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      undefined
    );
    apiActionsGetSpy.mockImplementation(request => {
      request.handleError();
      return { type: 'MOCK_GET' };
    });

    renderInvocation();
    act(() => jest.advanceTimersByTime(OUTPUT_MAX_REFRESH_INTERVAL_MS));

    expect(apiActionsGetSpy).toHaveBeenCalledTimes(1);
    expect(apiActionsGetSpy.mock.calls[0][0].url).toBe(detailsURL);
    expect(API.get).not.toHaveBeenCalled();
  });

  it('does not fetch while collapsed', () => {
    renderInvocation({ isExpanded: false });

    expect(API.get).not.toHaveBeenCalled();
    expect(apiActionsGetSpy).not.toHaveBeenCalled();
  });

  it('pauses output requests while the document is hidden', () => {
    const visibilityState = Object.getOwnPropertyDescriptor(
      document,
      'visibilityState'
    );
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });

    try {
      renderInvocation();
      act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
      expect(API.get).not.toHaveBeenCalled();

      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'visible',
      });
      act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
      expect(API.get).toHaveBeenCalledTimes(1);
    } finally {
      if (visibilityState) {
        Object.defineProperty(document, 'visibilityState', visibilityState);
      } else {
        delete document.visibilityState;
      }
    }
  });

  it('does not fetch when the cached response is already finished', () => {
    selectors.selectTemplateInvocation.mockImplementation(() => () => ({
      ...mockTemplateInvocationResponse,
      finished: true,
    }));

    renderInvocation();

    expect(API.get).not.toHaveBeenCalled();
    expect(apiActionsGetSpy).not.toHaveBeenCalled();
  });

  it('cancels a scheduled poll when collapsed', () => {
    const localStore = makeStore();
    const { rerender } = render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(API.get).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(API.get).toHaveBeenCalledTimes(1);
  });

  it('ignores an in-flight response after unmount', async () => {
    let resolveRequest;
    API.get.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveRequest = resolve;
        })
    );

    const { unmount } = render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(API.get).toHaveBeenCalledTimes(1);

    unmount();
    await act(async () => {
      resolveRequest({ data: { output: [], refresh: true } });
    });
    act(() => {
      jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS);
    });

    expect(API.get).toHaveBeenCalledTimes(1);
  });
});
