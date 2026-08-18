import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as api from 'foremanReact/redux/API';
import * as selectors from '../JobInvocationSelectors';
import { TemplateInvocation } from '../TemplateInvocation';
import { OUTPUT_REFRESH_INTERVAL_MS } from '../JobInvocationConstants';
import {
  jobInvocationOutput,
  mockTemplateInvocationResponse,
} from './fixtures';

jest.spyOn(api, 'get');
jest.mock('../JobInvocationSelectors');

jest.mock('foremanReact/components/ToastsList', () => ({
  addToast: jest.fn(payload => ({ type: 'ADD_TOAST', payload })),
}));

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

  let apiGetSpy;

  const respond = (request, overrides = {}) => {
    const data =
      request.url === outputURL
        ? { output: [], refresh: true, ...overrides.output }
        : {
            ...mockTemplateInvocationResponse,
            finished: false,
            auto_refresh: true,
            ...overrides.details,
          };
    if (request.handleSuccess) request.handleSuccess({ data });
    return { type: 'MOCK_GET' };
  };

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
      .mockImplementation(request => respond(request));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    apiGetSpy.mockRestore();
  });

  it('requests only output added since the latest displayed chunk', () => {
    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );

    expect(apiGetSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: outputURL,
        params: {
          since: jobInvocationOutput[jobInvocationOutput.length - 1].timestamp,
        },
      })
    );
  });

  it('polls output once per output refresh interval', () => {
    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(apiGetSpy).toHaveBeenCalledTimes(2);
    expect(apiGetSpy.mock.calls[1][0].url).toBe(outputURL);
  });

  it('appends new output without replacing the displayed output', () => {
    apiGetSpy.mockImplementation(request =>
      respond(request, {
        output: {
          output: [
            {
              output_type: 'stdout',
              output: 'New live output\n',
              timestamp: 1733931150.2044532,
            },
          ],
        },
      })
    );

    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );

    expect(screen.getByText('This is red text')).toBeInTheDocument();
    expect(screen.getByText('New live output')).toBeInTheDocument();
  });

  it('refreshes the complete details once after host output finishes', () => {
    apiGetSpy.mockImplementation(request =>
      respond(request, {
        output: { refresh: false },
        details: { finished: false, auto_refresh: true },
      })
    );

    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );

    expect(apiGetSpy).toHaveBeenCalledTimes(2);
    expect(apiGetSpy.mock.calls[0][0].url).toBe(outputURL);
    expect(apiGetSpy.mock.calls[1][0].url).toBe(detailsURL);

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS * 2));

    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });

  it('loads complete details first when no cached response exists', () => {
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      undefined
    );

    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy.mock.calls[0][0].url).toBe(detailsURL);

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(apiGetSpy).toHaveBeenCalledTimes(2);
    expect(apiGetSpy.mock.calls[1][0].url).toBe(outputURL);
  });

  it('does not poll output when complete details disable auto refresh', () => {
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      undefined
    );
    apiGetSpy.mockImplementation(request =>
      respond(request, { details: { auto_refresh: false } })
    );

    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );

    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS * 2));

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy.mock.calls[0][0].url).toBe(detailsURL);
  });

  it('does not fetch while collapsed', () => {
    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );

    expect(apiGetSpy).not.toHaveBeenCalled();
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
      render(
        <Provider store={makeStore()}>
          <TemplateInvocation {...pollingProps} />
        </Provider>
      );
      act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
      expect(apiGetSpy).not.toHaveBeenCalled();

      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'visible',
      });
      act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));
      expect(apiGetSpy).toHaveBeenCalledTimes(1);
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

    render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );

    expect(apiGetSpy).not.toHaveBeenCalled();
  });

  it('cancels a scheduled poll when collapsed', () => {
    const localStore = makeStore();
    const { rerender } = render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    act(() => jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS));

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('ignores an in-flight response after unmount', () => {
    let capturedHandleSuccess;
    apiGetSpy.mockImplementation(({ handleSuccess }) => {
      capturedHandleSuccess = handleSuccess;
      return { type: 'MOCK_GET' };
    });

    const { unmount } = render(
      <Provider store={makeStore()}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    unmount();
    act(() => {
      capturedHandleSuccess({ data: { output: [], refresh: true } });
      jest.advanceTimersByTime(OUTPUT_REFRESH_INTERVAL_MS);
    });

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });
});
