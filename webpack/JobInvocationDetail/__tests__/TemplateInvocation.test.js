import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as api from 'foremanReact/redux/API';
import * as selectors from '../JobInvocationSelectors';
import { TemplateInvocation } from '../TemplateInvocation';
import { mockTemplateInvocationResponse } from './fixtures';

jest.spyOn(api, 'get');
jest.mock('../JobInvocationSelectors');

const mockStore = configureMockStore([]);
const store = mockStore({
  HOSTS_API: {
    response: {
      subtotal: 3,
    },
  },
});

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
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
    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'RESOLVED'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      mockTemplateInvocationResponse
    );
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
    expect(screen.getByLabelText('Copy to clipboard')).toBeInTheDocument();
  });

  test('shows "No output" message when all toggles are off', () => {
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(
      screen.queryByText('No output for the selected filters')
    ).not.toBeInTheDocument();

    const newProps = {
      ...mockProps,
      showOutputType: { stderr: false, stdout: false, debug: false },
    };

    rerender(
      <Provider store={store}>
        <TemplateInvocation {...newProps} />
      </Provider>
    );

    expect(
      screen.getByText('No output for the selected filters')
    ).toBeInTheDocument();
  });

  test('correctly filters specific output types', () => {
    const { rerender } = render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(screen.getByText('Exit status: 1')).toBeInTheDocument(); // stdout
    expect(
      screen.getByText('StandardError: Job execution failed')
    ).toBeInTheDocument(); // debug

    // Turn off stdout
    rerender(
      <Provider store={store}>
        <TemplateInvocation
          {...mockProps}
          showOutputType={{ stderr: true, stdout: false, debug: true }}
        />
      </Provider>
    );
    expect(screen.queryByText('Exit status: 1')).not.toBeInTheDocument();
    expect(
      screen.getByText('StandardError: Job execution failed')
    ).toBeInTheDocument();

    // Turn off debug
    rerender(
      <Provider store={store}>
        <TemplateInvocation
          {...mockProps}
          showOutputType={{ stderr: true, stdout: false, debug: false }}
        />
      </Provider>
    );
    expect(screen.queryByText('Exit status: 1')).not.toBeInTheDocument();
    expect(
      screen.queryByText('StandardError: Job execution failed')
    ).not.toBeInTheDocument();
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
        <TemplateInvocation {...mockProps} />
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
    selectors.selectTemplateInvocation.mockImplementation(() => () => null);
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('template-invocation-skeleton')
    ).toBeInTheDocument();
  });

  test('copies text to clipboard when clicked', async () => {
    render(
      <Provider store={store}>
        <TemplateInvocation {...mockProps} />
      </Provider>
    );

    const copyButton = screen.getByLabelText('Copy to clipboard');
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText('Successfully copied to clipboard!')
    ).toBeInTheDocument();
  });

  test('handles null preview object gracefully', async () => {
    const mockResponseWithNullPreview = {
      ...mockTemplateInvocationResponse,
      preview: null,
    };

    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'RESOLVED'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      mockResponseWithNullPreview
    );

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

    // Enable showCommand to trigger preview rendering
    act(() => {
      fireEvent.click(screen.getByText('Command'));
    });

    // Should not crash and should not display any preview content
    expect(screen.queryByText('template-invocation-preview')).not.toBeInTheDocument();
  });

  test('handles undefined preview.plain gracefully', async () => {
    const mockResponseWithUndefinedPreview = {
      ...mockTemplateInvocationResponse,
      preview: {}, // preview object exists but plain is undefined
    };

    selectors.selectTemplateInvocationStatus.mockImplementation(() => () =>
      'RESOLVED'
    );
    selectors.selectTemplateInvocation.mockImplementation(() => () =>
      mockResponseWithUndefinedPreview
    );

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

    // Enable showCommand to trigger preview rendering
    act(() => {
      fireEvent.click(screen.getByText('Command'));
    });

    // Should not crash - the optional chaining should handle undefined preview.plain
    expect(() => {
      screen.getByText('template-invocation-preview');
    }).not.toThrow();
  });
});
