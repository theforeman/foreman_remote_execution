import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { APIActions } from 'foremanReact/redux/API';
import { createForemanContextWrapper } from './foremanTestHelpers';
import JobInvocationHostTable from '../JobInvocationHostTable';
import { JOB_INVOCATION_HOSTS } from '../JobInvocationConstants';

jest.useFakeTimers();

jest.mock('foremanReact/redux/API/APISelectors', () =>
  jest.requireActual('foremanReact/redux/API/APISelectors')
);

jest.mock('foremanReact/common/hooks/Permissions/permissionHooks', () => ({
  usePermissions: jest.fn(() => true),
}));

jest.mock('../TemplateInvocation', () => ({
  TemplateInvocation: () => <div data-testid="template-invocation" />,
}));

jest.mock('../TemplateInvocationComponents/TemplateActionButtons', () => ({
  RowActions: () => <div data-testid="row-actions" />,
}));

const mockStore = configureMockStore([thunk]);

const hostsResponse = {
  total: 1,
  subtotal: 1,
  page: 1,
  per_page: 20,
  auto_refresh: true,
  results: [
    {
      id: 1,
      name: 'host1.example.com',
      operatingsystem_id: 1,
      operatingsystem_name: 'RHEL 9',
      hostgroup_id: 1,
      hostgroup_name: 'default',
      job_status: 'success',
      smart_proxy_id: 1,
      smart_proxy_name: 'proxy1',
    },
  ],
};

const finishedHostsResponse = {
  ...hostsResponse,
  auto_refresh: false,
};

let apiGetSpy;
let hostsCalls;
let pendingCallbacks;

const createStore = () =>
  mockStore({
    API: {},
  });

const flushPendingCallbacks = () => {
  const batch = [...pendingCallbacks];
  pendingCallbacks = [];
  batch.forEach(cb => cb());
};

const renderTable = (props = {}) => {
  const store = createStore();
  const history = createMemoryHistory();
  const Wrapper = createForemanContextWrapper();

  const defaultProps = {
    id: '42',
    targeting: { targeting_type: 'static_query', search_query: '' },
    initialFilter: 'all_statuses',
    onFilterUpdate: jest.fn(),
    ...props,
  };

  const result = render(
    <Provider store={store}>
      <Router history={history}>
        <Wrapper>
          <JobInvocationHostTable {...defaultProps} />
        </Wrapper>
      </Router>
    </Provider>
  );

  return { ...result, store, history };
};

let mockResponse;

const setupSuccessMock = (response = hostsResponse) => {
  mockResponse = response;
  apiGetSpy = jest
    .spyOn(APIActions, 'get')
    .mockImplementation(opts => dispatch => {
      if (opts.key === JOB_INVOCATION_HOSTS) {
        hostsCalls.push(opts);
        if (opts.handleSuccess) {
          pendingCallbacks.push(() =>
            opts.handleSuccess({ data: mockResponse })
          );
        }
      }
    });
};

const setupErrorMock = () => {
  apiGetSpy = jest
    .spyOn(APIActions, 'get')
    .mockImplementation(opts => dispatch => {
      if (opts.key === JOB_INVOCATION_HOSTS) {
        hostsCalls.push(opts);
        if (opts.handleError) {
          pendingCallbacks.push(() => opts.handleError());
        }
      }
    });
};

describe('JobInvocationHostTable polling', () => {
  beforeEach(() => {
    hostsCalls = [];
    pendingCallbacks = [];
    mockResponse = hostsResponse;
    setupSuccessMock();
  });

  afterEach(() => {
    apiGetSpy.mockRestore();
    jest.clearAllTimers();
  });

  it('schedules a poll after the initial fetch succeeds', () => {
    renderTable();

    expect(hostsCalls).toHaveLength(1);

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(2);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(3);
  });

  it('does not schedule a poll when auto_refresh is false', () => {
    setupSuccessMock(finishedHostsResponse);
    renderTable();

    expect(hostsCalls).toHaveLength(1);

    act(() => {
      flushPendingCallbacks();
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(1);
  });

  it('stops polling when auto_refresh transitions to false', () => {
    renderTable();

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(1);

    mockResponse = finishedHostsResponse;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(2);

    const callsAfterFinished = hostsCalls.length;

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(callsAfterFinished);
  });

  it('cleans up the poll timer on unmount', () => {
    const { unmount } = renderTable();

    act(() => {
      flushPendingCallbacks();
    });

    const callsBeforeUnmount = hostsCalls.length;

    unmount();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(callsBeforeUnmount);
  });

  it('restarts polling when filter changes', () => {
    const { rerender } = renderTable({ initialFilter: 'all_statuses' });

    act(() => {
      flushPendingCallbacks();
    });

    const callsBeforeFilterChange = hostsCalls.length;

    const store = createStore();
    const history = createMemoryHistory();
    const Wrapper = createForemanContextWrapper();

    act(() => {
      rerender(
        <Provider store={store}>
          <Router history={history}>
            <Wrapper>
              <JobInvocationHostTable
                id="42"
                targeting={{
                  targeting_type: 'static_query',
                  search_query: '',
                }}
                initialFilter="success"
                jobFinished={false}
                onFilterUpdate={jest.fn()}
              />
            </Wrapper>
          </Router>
        </Provider>
      );
    });

    expect(hostsCalls.length).toBeGreaterThan(callsBeforeFilterChange);

    act(() => {
      flushPendingCallbacks();
    });

    const callsAfterFilterChange = hostsCalls.length;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls.length).toBeGreaterThan(callsAfterFilterChange);
  });

  it('sends include_permissions only on the first request', () => {
    renderTable();

    expect(hostsCalls).toHaveLength(1);
    expect(hostsCalls[0].params.include_permissions).toBe(true);

    act(() => {
      flushPendingCallbacks();
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(2);
    expect(hostsCalls[1].params.include_permissions).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(3);
    expect(hostsCalls[2].params.include_permissions).toBeUndefined();
  });

  it('stops polling on API error', () => {
    apiGetSpy.mockRestore();
    setupErrorMock();

    renderTable();

    expect(hostsCalls).toHaveLength(1);

    act(() => {
      flushPendingCallbacks();
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(1);
  });
});
