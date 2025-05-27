/* eslint-disable max-lines */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OpenAllInvocationsModal, {
  PopupAlert,
} from '../OpenAllInvocationsModal';
import {
  templateInvocationPageUrl,
  MAX_HOSTS_API_SIZE,
} from '../JobInvocationConstants';
import { CheckboxesActions } from '../CheckboxesActions';

// Mock the templateInvocationPageUrl function
jest.mock('../JobInvocationConstants', () => ({
  ...jest.requireActual('../JobInvocationConstants'),
  templateInvocationPageUrl: jest.fn((resultId, id) => `url/${resultId}/${id}`),
}));
const mockStore = configureStore([]);

describe('Opening selected in new tabs', () => {
  const mockResults = [1, 2, 3];
  const mockSetShowAlert = jest.fn();
  let windowSpy;
  const store = mockStore({});
  const windowOpen = window.open;

  beforeAll(() => {
    window.open = () => {};
  });
  afterAll(() => {
    windowSpy.mockRestore();
    jest.clearAllMocks();
    window.open = windowOpen;
  });

  test('renders modal without crashing', () => {
    render(
      <OpenAllInvocationsModal
        allHostsIds={mockResults}
        bulkParams="id ^ (1,2,3)"
        id="test-id"
        isAllSelected={false}
        setShowAlert={mockSetShowAlert}
        fetchFailedHosts={() => {}}
        isOpenFailed={false}
        failedCount={0}
        isOpen
        jobID="42"
        onClose={jest.fn()}
      />
    );
  });

  test('opens links when results length is less than or equal to 3', async () => {
    render(
      <Provider store={store}>
        <CheckboxesActions
          allHostsIds={mockResults}
          areAllRowsSelected
          bulkParams=""
          failedCount={0}
          isAllSelected
          jobID="42"
        />
        <OpenAllInvocationsModal
          allHostsIds={mockResults}
          bulkParams="id ^ (1,2,3)"
          id="test-id"
          isAllSelected={false}
          setShowAlert={mockSetShowAlert}
          fetchFailedHosts={() => {}}
          isOpenFailed={false}
          failedCount={0}
          isOpen
          jobID="42"
          onClose={jest.fn()}
        />
      </Provider>
    );

    const button = screen.getByLabelText(
      /open all template invocations in new tab/i
    );
    fireEvent.click(button);

    expect(templateInvocationPageUrl).toHaveBeenCalledTimes(mockResults.length);
    mockResults.forEach((result, index) => {
      expect(templateInvocationPageUrl.mock.calls[index]).toEqual([
        result,
        '42',
      ]);
    });
  });

  test('shows modal when results length is greater than 3', () => {
    const largeResults = [...mockResults, 4];
    render(
      <Provider store={store}>
        <CheckboxesActions
          allHostsIds={mockResults}
          areAllRowsSelected
          bulkParams=""
          failedCount={0}
          isAllSelected
          jobID="42"
        />
        <OpenAllInvocationsModal
          results={largeResults}
          id="test-id"
          isAllSelected={false}
          setShowAlert={mockSetShowAlert}
          fetchFailedHosts={() => {}}
          isOpenFailed={false}
          failedCount={0}
          isOpen
          jobID="42"
          onClose={jest.fn()}
          allHostsIds={mockResults}
          bulkParams="id ^ (1,2,3)"
        />
      </Provider>
    );

    const button = screen.getByLabelText(
      /open all template invocations in new tab/i
    );
    fireEvent.click(button);

    expect(
      screen.getAllByText(/open all selected invocations in new tabs/i)
    ).toHaveLength(2);
  });

  test('shows alert when popups are blocked', async () => {
    window.open = jest.fn().mockReturnValueOnce(null);

    render(
      <Provider store={store}>
        <CheckboxesActions
          allHostsIds={mockResults}
          areAllRowsSelected
          bulkParams=""
          failedCount={0}
          isAllSelected
          jobID="42"
        />
        <OpenAllInvocationsModal
          allHostsIds={mockResults}
          bulkParams="id ^ (1,2,3)"
          id="test-id"
          isAllSelected={false}
          setShowAlert={mockSetShowAlert}
          fetchFailedHosts={() => {}}
          isOpenFailed={false}
          failedCount={0}
          isOpen
          jobID="42"
          onClose={jest.fn()}
        />
      </Provider>
    );

    const button = screen.getByLabelText(
      /open all template invocations in new tab/i
    );
    fireEvent.click(button);

    const alertTitle = await screen.findByText(
      'Popups are blocked by your browser. Please allow popups for this site to open all invocations in new tabs.'
    );
    expect(alertTitle).toBeInTheDocument();
  });
});

describe('Opening failed in new tabs', () => {
  const mockResults = [1, 2, 3];
  const mockSetShowAlert = jest.fn();
  let windowSpy;
  const store = mockStore({});
  const windowOpen = window.open;

  beforeAll(() => {
    window.open = () => {};
  });
  afterAll(() => {
    windowSpy.mockRestore();
    jest.clearAllMocks();
    window.open = windowOpen;
  });

  test('opens links when results length is less than or equal to 3', async () => {
    const mockFailedHosts = [{ id: 301 }, { id: 302 }, { id: 303 }];
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: { results: mockFailedHosts } });
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => ({}));

    render(
      <Provider store={store}>
        <CheckboxesActions
          allHostsIds={mockResults}
          areAllRowsSelected
          bulkParams=""
          failedCount={0}
          isAllSelected
          jobID="42"
        />
        <OpenAllInvocationsModal
          allHostsIds={mockResults}
          bulkParams="id ^ (1,2,3)"
          id="test-id"
          isAllSelected={false}
          setShowAlert={mockSetShowAlert}
          fetchFailedHosts={() => {}}
          isOpenFailed={false}
          failedCount={3}
          isOpen
          jobID="42"
          onClose={jest.fn()}
        />
      </Provider>
    );

    const kebabToggle = screen.getByLabelText(/actions dropdown toggle/i);
    fireEvent.click(kebabToggle);
    const openFailedItem = screen.getByText(/open all failed runs/i);
    fireEvent.click(openFailedItem);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `foreman/api/job_invocations/42/hosts`,
        {
          params: {
            per_page: MAX_HOSTS_API_SIZE,
            search: 'job_invocation.result = failed',
          },
        }
      );

      expect(openSpy).toHaveBeenCalledTimes(mockFailedHosts.length);
      mockFailedHosts.forEach((host, index) => {
        expect(openSpy.mock.calls[index][0]).toBe(`url/${host.id}/42`);
      });
    });

    openSpy.mockRestore();
  });

  test('shows modal when results length is greater than 3', async () => {
    const largeResults = [{ id: 301 }, { id: 302 }, { id: 303 }, { id: 304 }];

    // const largeResultsOLD = [...mockResults, 4];
    render(
      <Provider store={store}>
        <CheckboxesActions
          allHostsIds={mockResults}
          areAllRowsSelected
          bulkParams=""
          failedCount={4}
          isAllSelected
          jobID="42"
        />
        <OpenAllInvocationsModal
          results={largeResults}
          id="test-id"
          isAllSelected={false}
          setShowAlert={mockSetShowAlert}
          fetchFailedHosts={() => {}}
          isOpenFailed={false}
          failedCount={4}
          isOpen
          jobID="42"
          onClose={jest.fn()}
          allHostsIds={mockResults}
          bulkParams="id ^ (1,2,3)"
        />
      </Provider>
    );

    const kebabToggle = screen.getByLabelText(/actions dropdown toggle/i);
    fireEvent.click(kebabToggle);

    const openFailedItem = screen.getByText(/open all failed runs/i);
    fireEvent.click(openFailedItem);

    await waitFor(() => {
      expect(
        screen.getAllByText(/open all selected invocations in new tabs/i)
      ).toHaveLength(2);
    });
  });
});

describe('PopupAlert', () => {
  const mockSetShowAlert = jest.fn();

  test('renders without crashing', () => {
    render(<PopupAlert setShowAlert={mockSetShowAlert} />);
  });

  test('closes alert when close button is clicked', () => {
    render(<PopupAlert setShowAlert={mockSetShowAlert} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetShowAlert).toHaveBeenCalledWith(false);
  });
});

describe('Rerun button', () => {
  const store = mockStore({
    templateInvocation: {
      permissions: {
        execute_jobs: true,
      },
    },
  });

  const mockAllHostsIds = [101, 102, 103];
  const jobID = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('is enabled when permissions and ids are valid', () => {
    render(
      <Provider store={store}>
        <CheckboxesActions
          allHostsIds={mockAllHostsIds}
          areAllRowsSelected
          bulkParams=""
          failedCount={1}
          isAllSelected
          jobID={jobID}
        />
      </Provider>
    );

    const rerunLink = screen.getByRole('link', {
      name: /rerun selected template invocations/i,
    });

    expect(rerunLink).toBeEnabled();
    expect(rerunLink).toHaveAttribute(
      'href',
      `foreman/job_invocations/${jobID}/rerun?host_ids[]=101&host_ids[]=102&host_ids[]=103`
    );
  });
});
