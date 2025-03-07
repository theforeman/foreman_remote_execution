import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as APIHooks from 'foremanReact/common/hooks/API/APIHooks';
import * as api from 'foremanReact/redux/API';
import { TemplateInvocation } from '../TemplateInvocation';
import { mockTemplateInvocationResponse } from './fixtures';

jest.spyOn(api, 'get');
jest.mock('foremanReact/common/hooks/API/APIHooks');
APIHooks.useAPI.mockImplementation(() => ({
  response: mockTemplateInvocationResponse,
  status: 'RESOLVED',
}));

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
          hostName="example-host"
        />
      </Provider>
    );

    expect(screen.getByText('Target:')).toBeInTheDocument();
    expect(screen.getByText('example-host')).toBeInTheDocument();

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
          hostName="example-host"
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
    APIHooks.useAPI.mockImplementation(() => ({
      response: { response: { data: { error: 'Error message' } } },
      status: 'ERROR',
    }));

    render(
      <TemplateInvocation
        hostID="1"
        jobID="1"
        isInTableView={false}
        hostName="example-host"
      />
    );

    expect(
      screen.getByText(
        'An error occurred while fetching the template invocation details.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('displays a skeleton while loading', async () => {
    APIHooks.useAPI.mockImplementation(() => ({
      response: {},
      status: 'PENDING',
    }));
    render(
      <TemplateInvocation
        hostID="1"
        jobID="1"
        isInTableView={false}
        hostName="example-host"
      />
    );

    expect(document.querySelectorAll('.pf-v5-c-skeleton')).toHaveLength(1);
  });
});
