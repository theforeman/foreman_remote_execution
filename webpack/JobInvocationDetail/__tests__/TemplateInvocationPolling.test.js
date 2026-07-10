import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { render, act } from '@testing-library/react';
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
    const localStore = makeStore();
    render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('does not fetch on mount when isExpanded is false', () => {
    const localStore = makeStore();
    render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    expect(apiGetSpy).not.toHaveBeenCalled();
  });

  it('schedules next poll via setTimeout when auto_refresh is true and not finished', () => {
    const localStore = makeStore();
    render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });

  it('does not schedule next poll when finished is true', () => {
    apiGetSpy.mockImplementation(({ handleSuccess }) => {
      handleSuccess &&
        handleSuccess({ data: { finished: true, auto_refresh: true } });
      return { type: 'MOCK_GET' };
    });
    const localStore = makeStore();
    render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('does not schedule next poll when auto_refresh is false', () => {
    apiGetSpy.mockImplementation(({ handleSuccess }) => {
      handleSuccess &&
        handleSuccess({ data: { finished: false, auto_refresh: false } });
      return { type: 'MOCK_GET' };
    });
    const localStore = makeStore();
    render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('clears the polling timeout and sets cancelled on unmount', () => {
    const localStore = makeStore();
    const { unmount } = render(
      <Provider store={localStore}>
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

    const localStore = makeStore();
    const { unmount } = render(
      <Provider store={localStore}>
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
    const localStore = makeStore();
    const { rerender } = render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    expect(apiGetSpy).not.toHaveBeenCalled();

    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('does not re-fetch on expand when response is already finished', () => {
    selectors.selectTemplateInvocation.mockImplementation(() => () => ({
      ...mockTemplateInvocationResponse,
      finished: true,
    }));
    apiGetSpy.mockImplementation(({ handleSuccess }) => {
      handleSuccess &&
        handleSuccess({ data: { finished: true, auto_refresh: false } });
      return { type: 'MOCK_GET' };
    });

    const localStore = makeStore();
    const { rerender } = render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    expect(apiGetSpy).not.toHaveBeenCalled();

    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    // Selector already returns finished=true → guard skips dispatchFetch
    expect(apiGetSpy).not.toHaveBeenCalled();

    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    // Second expand: still finished → still no fetch
    expect(apiGetSpy).not.toHaveBeenCalled();
  });

  it('cancels existing poll and starts fresh when isExpanded changes', () => {
    const localStore = makeStore();
    const { rerender } = render(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded={false} />
      </Provider>
    );
    act(() => jest.advanceTimersByTime(5000));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={localStore}>
        <TemplateInvocation {...pollingProps} isExpanded />
      </Provider>
    );
    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });
});
