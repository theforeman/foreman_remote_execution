import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as api from 'foremanReact/redux/API';
import {
  getJobInvocation,
  stopJobInvocationPolling,
} from '../JobInvocationActions';
import { JOB_INVOCATION_KEY } from '../JobInvocationConstants';

jest.spyOn(api, 'get');
jest.useFakeTimers();

const mockStore = configureMockStore([thunk]);

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
  beforeEach(() => {
    api.get.mockReset();
    stopJobInvocationPolling();
    jest.clearAllTimers();
  });

  it('sends include_permissions and include_hosts on the initial fetch', () => {
    setupGetMock(succeededData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get.mock.calls[0][0]).toMatchObject({
      key: JOB_INVOCATION_KEY,
      url,
      params: { include_hosts: false, include_permissions: true },
    });
  });

  it('schedules the next poll when job is still running', () => {
    setupGetMock(runningData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    expect(api.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('does not send include_permissions on subsequent poll requests', () => {
    setupGetMock(runningData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(2);
    expect(api.get.mock.calls[1][0].params).not.toHaveProperty(
      'include_permissions'
    );
    expect(api.get.mock.calls[1][0].params).toMatchObject({
      include_hosts: false,
    });
  });

  it('stops polling when job succeeds', () => {
    setupGetMock(succeededData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    expect(api.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stops polling when job fails', () => {
    setupGetMock(failedData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stops polling when job is cancelled', () => {
    setupGetMock(cancelledData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stops polling on fetch error', () => {
    api.get.mockImplementation(({ handleError, ...action }) => {
      handleError && handleError();
      return { type: 'get', ...action };
    });
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('stopJobInvocationPolling cancels a pending timeout', () => {
    setupGetMock(runningData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    expect(api.get).toHaveBeenCalledTimes(1);

    stopJobInvocationPolling();
    jest.advanceTimersByTime(5000);

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('getJobInvocation cancels any existing poll before starting a new one', () => {
    setupGetMock(runningData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    expect(api.get).toHaveBeenCalledTimes(1);

    // Second call before the timeout fires should cancel the pending poll
    store.dispatch(getJobInvocation(url));
    jest.advanceTimersByTime(5000);

    // Only one more poll should fire (from the second invocation), not two
    expect(api.get).toHaveBeenCalledTimes(3);
  });

  it('keeps polling as long as the job is running', () => {
    setupGetMock(runningData);
    const store = mockStore({});

    store.dispatch(getJobInvocation(url));
    jest.advanceTimersByTime(15000);

    expect(api.get).toHaveBeenCalledTimes(4);
  });
});
