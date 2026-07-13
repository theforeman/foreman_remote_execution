import { createStore, applyMiddleware } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as api from 'foremanReact/redux/API';
import {
  getJobInvocation,
  stopJobInvocationPolling,
  enableRecurringLogic,
} from '../JobInvocationActions';
import { JOB_INVOCATION_KEY } from '../JobInvocationConstants';

jest.spyOn(api, 'get');
jest.useFakeTimers();

const reducer = (state = {}) => state;
const makeStore = () => createStore(reducer, applyMiddleware(thunk));
const makeRef = () => ({ current: null });

const runningData = { status_label: 'running' };
const succeededData = { status_label: 'succeeded' };
const failedData = { status_label: 'failed' };
const cancelledData = { status_label: 'cancelled' };

const setupGetMock = responseData => {
  api.get.mockImplementation(({ handleSuccess, ...action }) => {
    handleSuccess && handleSuccess({ data: responseData });
    return { type: 'get', ...action };
  });
};

const url = '/api/job_invocations/1';

describe('job invocation polling', () => {
  let ref;

  beforeEach(() => {
    ref = makeRef();
    api.get.mockReset();
    jest.clearAllTimers();
  });

  it('sends include_permissions and include_hosts on the initial fetch', () => {
    setupGetMock(succeededData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get.mock.calls[0][0]).toMatchObject({
      key: JOB_INVOCATION_KEY,
      url,
      params: { include_hosts: false, include_permissions: true },
    });
  });

  it('schedules the next poll when job is still running', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(api.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('includes include_permissions=true in every poll call', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(2);
    expect(api.get.mock.calls[1][0].params).toMatchObject({
      include_hosts: false,
      include_permissions: true,
    });
  });

  it('stops polling when job succeeds', () => {
    setupGetMock(succeededData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(api.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stops polling when job fails', () => {
    setupGetMock(failedData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stops polling when job is cancelled', () => {
    setupGetMock(cancelledData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stops polling on fetch error', () => {
    api.get.mockImplementation(({ handleError, ...action }) => {
      handleError && handleError();
      return { type: 'get', ...action };
    });
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stopJobInvocationPolling cancels a pending timeout', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(api.get).toHaveBeenCalledTimes(1);

    stopJobInvocationPolling(ref);
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('getJobInvocation cancels any existing poll before starting a new one', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    expect(api.get).toHaveBeenCalledTimes(1);

    // Second call before the timeout fires should cancel the pending poll
    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(5000);

    // Only one more poll should fire (from the second invocation), not two
    expect(api.get).toHaveBeenCalledTimes(3);
  });

  it('keeps polling as long as the job is running', () => {
    setupGetMock(runningData);
    const store = makeStore();

    store.dispatch(getJobInvocation(url, ref));
    jest.advanceTimersByTime(15000);

    expect(api.get).toHaveBeenCalledTimes(4);
  });
});

describe('enableRecurringLogic', () => {
  const mockStore = configureMockStore([thunk]);

  it('re-fetches job invocation after successful disable/enable', () => {
    jest
      .spyOn(api.APIActions, 'put')
      .mockImplementation(({ handleSuccess, ...action }) => {
        handleSuccess && handleSuccess();
        return { type: 'MOCK_PUT', ...action };
      });
    api.get.mockImplementation(({ ...action }) => ({ type: 'get', ...action }));

    const store = mockStore({});
    store.dispatch(enableRecurringLogic(1, true, 42));

    const actions = store.getActions();
    const getAction = actions.find(a => a.key === JOB_INVOCATION_KEY);
    expect(getAction).toBeDefined();
    expect(getAction.url).toBe('/api/job_invocations/42');

    api.APIActions.put.mockRestore();
    api.get.mockReset();
  });
});
