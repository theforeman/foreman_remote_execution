import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as api from 'foremanReact/redux/API';
import * as selectors from '../JobInvocationSelectors';
import { TemplateInvocation } from '../TemplateInvocation';
import { mockTemplateInvocationResponse } from './fixtures';

jest.spyOn(api, 'get');
jest.mock('../JobInvocationSelectors');

jest.mock('@patternfly/react-core', () => {
  const originalModule = jest.requireActual('@patternfly/react-core');
  return {
    ...originalModule,
    Tooltip: ({ children }) => <>{children}</>,
    Popper: ({ children }) => <>{children}</>,
    ClipboardCopyButton: jest.fn(props => (
      <button data-testid="mock-clipboard-copy-button">
        {props.children || 'Mock Copy Button'}
      </button>
    )),
  };
});

const mockStore = configureMockStore([]);
const store = mockStore({
  HOSTS_API: {
    response: {
      subtotal: 3,
    },
  },
});

const mockProps = {
  hostID: '1',
  jobID: '1',
  isInTableView: false,
  isExpanded: true,
  hostName: 'example-host',
  hostProxy: { name: 'example-proxy', href: '#' },
  showOutputType: { stderr: true, stdout: true, debug: true },
  setShowOutputType: jest.fn(),
  showTemplatePreview: false,
  setShowTemplatePreview: jest.fn(),
  showCommand: false,
  setShowCommand: jest.fn(),
};

describe('TemplateInvocation', () => {
  beforeEach(() => {
    if (navigator.clipboard?.writeText?.mockClear) {
      navigator.clipboard.writeText.mockClear();
    }
    const { ClipboardCopyButton } = require('@patternfly/react-core');
     if (ClipboardCopyButton?.mockClear) {
        ClipboardCopyButton.mockClear();
     }

    selectors.selectTemplateInvocationStatus.mockImplementation(() => () => 'RESOLVED');
    selectors.selectTemplateInvocation.mockImplementation(() => () => mockTemplateInvocationResponse);
  });

  test('render', () => {
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(screen.getByText('example-host')).toBeInTheDocument();
    expect(screen.getByText('example-proxy')).toBeInTheDocument();

    expect(screen.getByText(/using Smart Proxy/)).toBeInTheDocument();
    expect(screen.getByText(/Target:/)).toBeInTheDocument();

    expect(screen.getByText('This is red text')).toBeInTheDocument();
    expect(screen.getByText('This is default text')).toBeInTheDocument();
    expect(screen.getByTestId('mock-clipboard-copy-button')).toBeInTheDocument();
  });

  test('shows "No output" message when all toggles are off', () => {
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(screen.queryByText('No output for the selected filters')).not.toBeInTheDocument();

    const newProps = {
      ...mockProps,
      showOutputType: { stderr: false, stdout: false, debug: false },
    };

    rerender(
      <Provider store={store}>
        <TemplateInvocation {...newProps} />
      </Provider>
    );

    expect(screen.getByText('No output for the selected filters')).toBeInTheDocument();
  });

  test('correctly filters specific output types', () => {
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(screen.getByText('Exit status: 1')).toBeInTheDocument(); // stdout
    expect(screen.getByText('StandardError: Job execution failed')).toBeInTheDocument(); // debug

    // Turn off stdout
    rerender(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} showOutputType={{ stderr: true, stdout: false, debug: true }} />
      </Provider>
    );
    expect(screen.queryByText('Exit status: 1')).not.toBeInTheDocument();
    expect(screen.getByText('StandardError: Job execution failed')).toBeInTheDocument();

    // Turn off debug
    rerender(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} showOutputType={{ stderr: true, stdout: false, debug: false }} />
      </Provider>
    );
    expect(screen.queryByText('Exit status: 1')).not.toBeInTheDocument();
    expect(screen.queryByText('StandardError: Job execution failed')).not.toBeInTheDocument();
  });

  test('displays an error alert when there is an error', () => {
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () => 'ERROR');
    selectors.selectTemplateInvocation.mockImplementation(() => () => ({
      response: { data: { error: 'Error message' } },
    }));
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(
      screen.getByText('An error occurred while fetching the template invocation details.')
    ).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('displays a skeleton while loading', () => {
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () => 'PENDING');
    selectors.selectTemplateInvocation.mockImplementation(() => () => null);

    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(screen.getByTestId('template-invocation-skeleton')).toBeInTheDocument();
  });
});
