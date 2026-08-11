/* eslint-disable max-lines */
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
  results: [
    {
      id: 1,
      name: 'host1.example.com',
      operatingsystem_id: 1,
      operatingsystem_name: 'RHEL 9',
      hostgroup_id: 1,
      hostgroup_name: 'default',
      job_status: 'running',
      smart_proxy_id: 1,
      smart_proxy_name: 'proxy1',
    },
  ],
};

const terminalHostsResponse = {
  ...hostsResponse,
  results: [{ ...hostsResponse.results[0], job_status: 'success' }],
};

const mixedHostsResponse = {
  ...hostsResponse,
  total: 2,
  subtotal: 2,
  results: [
    { ...hostsResponse.results[0], id: 1, job_status: 'success' },
    { ...hostsResponse.results[0], id: 2, job_status: 'running' },
  ],
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
    jobFinished: false,
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

const setupSuccessMock = (response = hostsResponse) => {
  apiGetSpy = jest
    .spyOn(APIActions, 'get')
    .mockImplementation(opts => dispatch => {
      if (opts.key === JOB_INVOCATION_HOSTS) {
        hostsCalls.push(opts);
        if (opts.handleSuccess) {
          pendingCallbacks.push(() => opts.handleSuccess({ data: response }));
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

  it('does not schedule a poll when jobFinished is true', () => {
    renderTable({ jobFinished: true });

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

  it('stops polling when jobFinished transitions to true', () => {
    const { rerender } = renderTable();

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(1);

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
                initialFilter="all_statuses"
                jobFinished
                onFilterUpdate={jest.fn()}
              />
            </Wrapper>
          </Router>
        </Provider>
      );
    });

    act(() => {
      flushPendingCallbacks();
    });

    const callsAtTransition = hostsCalls.length;

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      flushPendingCallbacks();
    });

    expect(hostsCalls).toHaveLength(callsAtTransition);
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

  it('stops polling when all hosts on the page are terminal', () => {
    apiGetSpy.mockRestore();
    setupSuccessMock(terminalHostsResponse);

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

  it('continues polling when at least one host on the page is non-terminal', () => {
    apiGetSpy.mockRestore();
    setupSuccessMock(mixedHostsResponse);

    renderTable();

    expect(hostsCalls).toHaveLength(1);

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
