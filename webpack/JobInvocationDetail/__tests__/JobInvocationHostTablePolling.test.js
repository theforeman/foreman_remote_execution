import React from 'react';
import { Provider } from 'react-redux';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as api from 'foremanReact/redux/API';
import JobInvocationHostTable from '../JobInvocationHostTable';

jest.mock(
  'foremanReact/components/PF4/TableIndexPage/TableIndexPage',
  () => jest.fn(() => <div data-testid="mock-table-index-page" />),
  { virtual: true }
);
jest.mock(
  'foremanReact/components/PF4/TableIndexPage/Table/Table',
  () => ({ Table: jest.fn(() => <div />) }),
  { virtual: true }
);
jest.mock(
  'foremanReact/components/PF4/TableIndexPage/Table/TableHooks',
  () => ({
    useBulkSelect: jest.fn(() => ({
      updateSearchQuery: jest.fn(),
      fetchBulkParams: jest.fn(() => ''),
      inclusionSet: new Set(),
      exclusionSet: new Set(),
      selectAll: jest.fn(),
      selectPage: jest.fn(),
      selectNone: jest.fn(),
      selectedCount: 0,
      selectOne: jest.fn(),
      areAllRowsOnPageSelected: jest.fn(() => false),
      areAllRowsSelected: jest.fn(() => false),
      isSelected: jest.fn(() => false),
    })),
    useUrlParams: jest.fn(() => ({})),
  }),
  { virtual: true }
);
jest.mock(
  'foremanReact/components/PF4/TableIndexPage/Table/helpers',
  () => ({ getPageStats: jest.fn(() => ({ pageRowCount: 0 })) }),
  { virtual: true }
);
jest.mock(
  'foremanReact/components/PF4/TableIndexPage/RowSelectTd',
  () => ({ RowSelectTd: jest.fn(() => null) }),
  { virtual: true }
);
jest.mock(
  'foremanReact/components/PF4/TableIndexPage/Table/SelectAllCheckbox',
  () => jest.fn(() => null),
  { virtual: true }
);
jest.mock('foremanReact/constants', () => ({
  getControllerSearchProps: jest.fn(() => ({
    autocomplete: { url: '' },
  })),
}));
jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanSettings: jest.fn(() => ({ perPage: 20 })),
  useForemanHostDetailsPageUrl: jest.fn(() => '/new/hosts/'),
}));
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ push: jest.fn() })),
}));
jest.mock('../CheckboxesActions', () => ({
  CheckboxesActions: jest.fn(() => null),
}));
jest.mock('../DropdownFilter', () => jest.fn(() => null));
jest.mock('../JobInvocationConstants', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
  JOB_INVOCATION_HOSTS: 'JOB_INVOCATION_HOSTS',
  AWAITING_STATUS_FILTER: '(job_invocation.result = N/A)',
  STATUS_UPPERCASE: {
    RESOLVED: 'RESOLVED',
    ERROR: 'ERROR',
    PENDING: 'PENDING',
  },
  showTemplateInvocationUrl: jest.fn(() => ''),
  templateInvocationPageUrl: jest.fn(() => ''),
  GET_TEMPLATE_INVOCATION: 'GET_TEMPLATE_INVOCATION',
}));
jest.mock('../OpenAllInvocationsModal', () => ({
  PopupAlert: jest.fn(() => null),
}));

const noop = () => {};
const reducer = (state = {}) => state;
const makeStore = () => createStore(reducer, applyMiddleware(thunk));

const defaultProps = {
  id: '42',
  targeting: {},
  initialFilter: 'all_statuses',
  jobFinished: false,
  onFilterUpdate: noop,
};

describe('JobInvocationHostTable polling', () => {
  let apiGetSpy;

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    apiGetSpy = jest
      .spyOn(api.APIActions, 'get')
      .mockImplementation(({ handleSuccess, ...action }) => {
        handleSuccess &&
          handleSuccess({ data: { results: [], total: 0, subtotal: 0 } });
        return { type: 'MOCK_GET', ...action };
      });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    apiGetSpy.mockRestore();
  });

  it('starts polling when filter becomes non-empty', () => {
    const store = makeStore();
    const { rerender } = render(
      <Provider store={store}>
        <JobInvocationHostTable {...defaultProps} initialFilter="" />
      </Provider>
    );

    expect(apiGetSpy).not.toHaveBeenCalled();

    rerender(
      <Provider store={store}>
        <JobInvocationHostTable
          {...defaultProps}
          initialFilter="all_statuses"
        />
      </Provider>
    );

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  const renderAndTriggerFetch = (store, props = {}) => {
    const result = render(
      <Provider store={store}>
        <JobInvocationHostTable {...defaultProps} {...props} initialFilter="" />
      </Provider>
    );
    result.rerender(
      <Provider store={store}>
        <JobInvocationHostTable
          {...defaultProps}
          {...props}
          initialFilter="all_statuses"
        />
      </Provider>
    );
    return result;
  };

  it('schedules next poll via setTimeout when job is not finished', () => {
    const store = makeStore();
    renderAndTriggerFetch(store);

    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));

    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });

  it('does not schedule next poll when job is finished', () => {
    const store = makeStore();
    renderAndTriggerFetch(store, { jobFinished: true });

    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(5000));

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('respects jobFinishedRef — stops polling when jobFinished prop becomes true between polls', () => {
    const store = makeStore();
    const { rerender } = renderAndTriggerFetch(store, { jobFinished: false });

    expect(apiGetSpy).toHaveBeenCalledTimes(1);

    // Changing jobFinished triggers statusChanged, so filterApiCall runs once more.
    // But jobFinishedRef is now true, so that call does NOT schedule another poll.
    rerender(
      <Provider store={store}>
        <JobInvocationHostTable
          {...defaultProps}
          initialFilter="all_statuses"
          jobFinished
        />
      </Provider>
    );

    expect(apiGetSpy).toHaveBeenCalledTimes(2);

    act(() => jest.advanceTimersByTime(5000));

    // No further calls — polling has stopped.
    expect(apiGetSpy).toHaveBeenCalledTimes(2);
  });

  it('clears the polling timeout on unmount', () => {
    const store = makeStore();
    const { unmount } = renderAndTriggerFetch(store);

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
    unmount();

    act(() => jest.advanceTimersByTime(5000));

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
  });

  it('uses the current id in the api url after id prop changes', () => {
    const store = makeStore();
    renderAndTriggerFetch(store, { id: '42' });

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy.mock.calls[0][0].url).toContain('/42/');
  });

  it('re-fetches when id prop changes', () => {
    const store = makeStore();
    const { rerender } = renderAndTriggerFetch(store, { id: '42' });

    expect(apiGetSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy.mock.calls[0][0].url).toContain('/42/');

    rerender(
      <Provider store={store}>
        <JobInvocationHostTable
          {...defaultProps}
          id="99"
          initialFilter="all_statuses"
        />
      </Provider>
    );

    expect(apiGetSpy).toHaveBeenCalledTimes(2);
    expect(apiGetSpy.mock.calls[1][0].url).toContain('/99/');
  });
});
