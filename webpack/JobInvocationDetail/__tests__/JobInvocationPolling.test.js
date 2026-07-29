import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { APIActions } from 'foremanReact/redux/API';
import {
  getJobInvocation,
  stopJobInvocationPolling,
} from '../JobInvocationActions';
import {
  JOB_INVOCATION_KEY,
  POLLING_INTERVAL_MS,
} from '../JobInvocationConstants';

jest.useFakeTimers();

const reducer = (state = {}) => state;
const makeStore = () => createStore(reducer, applyMiddleware(thunk));
const makeRef = () => ({ current: { timeoutId: null, cancel: () => {} } });

const runningData = { status_label: 'running' };
const succeededData = { status_label: 'succeeded' };
const failedData = { status_label: 'failed' };
const cancelledData = { status_label: 'cancelled' };

let apiGetSpy;

const setupGetMock = responseData => {
  apiGetSpy = jest
    .spyOn(APIActions, 'get')
    .mockImplementation(({ handleSuccess, ...action }) => dispatch => {
      handleSuccess && handleSuccess({ data: responseData });
      return dispatch({ type: 'MOCK_GET', ...action });
    });
};

const url = '/api/job_invocations/1';

describe('job invocation polling', () => {
  let ref;

  beforeEach(() => {
    ref = makeRef();
    jest.clearAllTimers();
  });

  afterEach(() => {
    if (apiGetSpy) {
      apiGetSpy.mockRestore();
    }
  });

  it('sends include_permissions and include_hosts on the initial fetch', () => {
    setupGetMock(succeededData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy.mock.calls[0][0]).toMatchObject({
      key: JOB_INVOCATION_KEY,
      url,
      params: { include_hosts: false, include_permissions: true },
    });
  });

  it('schedules the next poll when job is still running', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(POLLING_INTERVAL_MS);
    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });

  it('does not include include_permissions on subsequent poll calls', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(POLLING_INTERVAL_MS);

    expect(apiGetSpy).toHaveBeenCalledTimes(2);
    expect(apiGetSpy.mock.calls[1][0].params).toMatchObject({
      include_hosts: false,
    });
    expect(apiGetSpy.mock.calls[1][0].params).not.toHaveProperty(
      'include_permissions'
    );
  });

  it('stops polling when job succeeds', () => {
    setupGetMock(succeededData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(POLLING_INTERVAL_MS);
    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('stops polling when job fails', () => {
    setupGetMock(failedData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(POLLING_INTERVAL_MS);

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('stops polling when job is cancelled', () => {
    setupGetMock(cancelledData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(POLLING_INTERVAL_MS);

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('stops polling on fetch error', () => {
    apiGetSpy = jest
      .spyOn(APIActions, 'get')
      .mockImplementation(({ handleError, ...action }) => dispatch => {
        handleError && handleError();
        return dispatch({ type: 'MOCK_GET', ...action });
      });
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(POLLING_INTERVAL_MS);

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('stopJobInvocationPolling cancels a pending timeout', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    stopJobInvocationPolling(ref);
    jest.advanceTimersByTime(POLLING_INTERVAL_MS);

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('cancels pending timeout before starting a new poll when called multiple times', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    // Second call before the timeout fires cancels the first timeout and starts fresh
    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(POLLING_INTERVAL_MS);

    // Only the second poll chain fires (first was cancelled)
    expect(apiGetSpy).toHaveBeenCalledTimes(3);
  });

  it('keeps polling as long as the job is running', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(POLLING_INTERVAL_MS * 3);

    expect(apiGetSpy).toHaveBeenCalledTimes(4);
  });

  it('cancels in-flight callback when new poll starts before previous resolves', () => {
    let firstCallHandleSuccess;
    let callCount = 0;
    apiGetSpy = jest
      .spyOn(APIActions, 'get')
      .mockImplementation(({ handleSuccess, handleError }) => dispatch => {
        callCount++;
        if (callCount === 1) {
          firstCallHandleSuccess = handleSuccess;
        }
        return dispatch({ type: 'MOCK_GET' });
      });

    const store = makeStore();
    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    // Start a new poll cycle before the first resolves
    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(2);

    // Old callback from first call tries to schedule next poll
    firstCallHandleSuccess({ data: runningData });

    // Timeout should not be set by the stale callback
    expect(ref.current.timeoutId).toBeNull();
  });

  it('ignores a stale response resolving after stopJobInvocationPolling (e.g. unmount)', () => {
    let capturedHandleSuccess;
    apiGetSpy = jest
      .spyOn(APIActions, 'get')
      .mockImplementation(({ handleSuccess }) => dispatch => {
        capturedHandleSuccess = handleSuccess;
        return dispatch({ type: 'MOCK_GET' });
      });

    const store = makeStore();
    store.dispatch(getJobInvocation(url, ref));
    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    // Simulate unmount: stop polling while the request is still in flight.
    stopJobInvocationPolling(ref);

    // The in-flight request resolves after the "unmount".
    capturedHandleSuccess({ data: runningData });

    // The stale response must not revive polling.
    expect(ref.current.timeoutId).toBeNull();
  });
});
