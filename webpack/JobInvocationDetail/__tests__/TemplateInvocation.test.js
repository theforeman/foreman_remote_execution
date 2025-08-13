import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as api from 'foremanReact/redux/API';
import * as selectors from '../JobInvocationSelectors';
import { TemplateInvocation } from '../TemplateInvocation';
import { mockTemplateInvocationResponse } from './fixtures';

jest.spyOn(api, 'get');
jest.mock('../JobInvocationSelectors');
selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
  'RESOLVED'
);
selectors.selectTemplateInvocation.mockImplementation(() => () =>
  mockTemplateInvocationResponse
);
const mockStore = configureMockStore([]);
const store = mockStore({
  HOSTS_API: {
    response: {
      subtotal: 3,
    },
  },
});
describe('TemplateInvocation', () => {
  test('render', async () => {
    render(
      <Provider store={store}>
        <TemplateInvocation
          hostID="1"
          jobID="1"
          isInTableView={false}
          isExpanded
          hostName="example-host"
          hostProxy={{ name: 'example-proxy', href: '#' }}
        />
      </Provider>
    );

    expect(screen.getByText('example-host')).toBeInTheDocument();
    expect(screen.getByText('example-proxy')).toBeInTheDocument();

    expect(screen.getByText(/using Smart Proxy/)).toBeInTheDocument();
    expect(screen.getByText(/Target:/)).toBeInTheDocument();

    expect(screen.getByText('This is red text')).toBeInTheDocument();
    expect(screen.getByText('This is default text')).toBeInTheDocument();
  });
  test('filtering toggles', () => {
    render(
      <Provider store={store}>
        <TemplateInvocation
          hostID="1"
          jobID="1"
          isInTableView={false}
          isExpanded
          hostName="example-host"
          hostProxy={{ name: 'example-proxy', href: '#' }}
        />
      </Provider>
    );

    act(() => {
      fireEvent.click(screen.getByText('STDOUT'));
      fireEvent.click(screen.getByText('DEBUG'));
      fireEvent.click(screen.getByText('STDERR'));
    });
    expect(
      screen.queryAllByText('No output for the selected filters')
    ).toHaveLength(1);
    expect(screen.queryAllByText('Exit status: 1')).toHaveLength(0);
    expect(
      screen.queryAllByText('StandardError: Job execution failed')
    ).toHaveLength(0);

    act(() => {
      fireEvent.click(screen.getByText('STDOUT'));
    });
    expect(
      screen.queryAllByText('No output for the selected filters')
    ).toHaveLength(0);
    expect(screen.queryAllByText('Exit status: 1')).toHaveLength(1);
    expect(
      screen.queryAllByText('StandardError: Job execution failed')
    ).toHaveLength(0);

    act(() => {
      fireEvent.click(screen.getByText('DEBUG'));
    });
    expect(
      screen.queryAllByText('No output for the selected filters')
    ).toHaveLength(0);
    expect(screen.queryAllByText('Exit status: 1')).toHaveLength(1);
    expect(
      screen.queryAllByText('StandardError: Job execution failed')
    ).toHaveLength(1);
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
        <TemplateInvocation
          hostID="1"
          jobID="1"
          isInTableView={false}
          isExpanded
          hostName="example-host"
          hostProxy={{ name: 'example-proxy', href: '#' }}
        />
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
    selectors.selectTemplateInvocation.mockImplementation(() => () => ({}));
    render(
      <Provider store={store}>
        <TemplateInvocation
          hostID="1"
          jobID="1"
          isInTableView={false}
          isExpanded
          hostName="example-host"
        />
      </Provider>
    );

    expect(document.querySelectorAll('.pf-v5-c-skeleton')).toHaveLength(1);
  });
});
