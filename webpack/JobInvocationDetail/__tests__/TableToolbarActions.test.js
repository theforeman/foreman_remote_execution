import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
  templateInvocationPageUrl,
  MAX_HOSTS_API_SIZE,
} from '../JobInvocationConstants';
import { CheckboxesActions } from '../CheckboxesActions';
import { PopupAlert } from '../OpenAllInvocationsModal';

jest.mock('axios');
jest.mock('../JobInvocationConstants', () => ({
  ...jest.requireActual('../JobInvocationConstants'),
  templateInvocationPageUrl: jest.fn(
    (hostId, jobId) => `url/${hostId}/${jobId}`
  ),
  DIRECT_OPEN_HOST_LIMIT: 3,
}));

const mockStore = configureStore([]);
const store = mockStore({
  templateInvocation: {
    permissions: {
      execute_jobs: true,
    },
  },
});

describe('TableToolbarActions', () => {
  const jobID = '42';
  let openSpy;

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
  });

  afterEach(() => {
    openSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('Opening selected in new tabs', () => {
    test('opens links when results length is less than or equal to 3', () => {
      const selectedIds = [1, 2, 3];
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={selectedIds}
            failedCount={0}
            jobID={jobID}
          />
        </Provider>
      );

      const openAllButton = screen.getByLabelText(
        /open all template invocations in new tab/i
      );
      fireEvent.click(openAllButton);

      expect(openSpy).toHaveBeenCalledTimes(selectedIds.length);
      selectedIds.forEach(id => {
        expect(templateInvocationPageUrl).toHaveBeenCalledWith(id, jobID);
        expect(openSpy).toHaveBeenCalledWith(
          templateInvocationPageUrl(id, jobID)
        );
      });
    });

    test('shows modal when results length is greater than 3', () => {
      const selectedIds = [1, 2, 3, 4];
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={selectedIds}
            failedCount={0}
            jobID={jobID}
          />
        </Provider>
      );

      const openAllButton = screen.getByLabelText(
        /open all template invocations in new tab/i
      );
      fireEvent.click(openAllButton);

      expect(
        screen.getByRole('heading', {
          name: /open all selected invocations in new tabs/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/The number of selected invocations is:/)
      ).toBeInTheDocument();
    });

    test('shows alert when popups are blocked', () => {
      openSpy.mockReturnValue(null);
      const selectedIds = [1, 2];
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={selectedIds}
            failedCount={0}
            jobID={jobID}
          />
        </Provider>
      );

      const openAllButton = screen.getByLabelText(
        /open all template invocations in new tab/i
      );
      fireEvent.click(openAllButton);

      expect(
        screen.getByText(/Popups are blocked by your browser/)
      ).toBeInTheDocument();
    });
  });

  describe('Opening failed in new tabs', () => {
    test('opens links when results length is less than or equal to 3', async () => {
      const failedHosts = [{ id: 301 }, { id: 302 }];
      axios.get.mockResolvedValueOnce({ data: { results: failedHosts } });

      render(
        <Provider store={store}>
          <CheckboxesActions selectedIds={[]} failedCount={2} jobID={jobID} />
        </Provider>
      );

      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(screen.getByText(/open all failed runs/i));

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          `foreman/api/job_invocations/${jobID}/hosts`,
          {
            params: {
              per_page: MAX_HOSTS_API_SIZE,
              search: 'job_invocation.result = failed',
            },
          }
        );
      });

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledTimes(failedHosts.length);
      });
    });

    test('shows modal when results length is greater than 3', async () => {
      const failedCount = 4;
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={[]}
            failedCount={failedCount}
            jobID={jobID}
          />
        </Provider>
      );

      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(screen.getByText(/open all failed runs/i));

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /open all failed invocations in new tabs/i,
          })
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText(/The number of failed invocations is:/)
      ).toBeInTheDocument();
    });
  });

  describe('PopupAlert', () => {
    test('renders without crashing', () => {
      const mockSetShowAlert = jest.fn();
      render(<PopupAlert setShowAlert={mockSetShowAlert} />);
      expect(
        screen.getByText(/Popups are blocked by your browser/)
      ).toBeInTheDocument();
    });

    test('closes alert when close button is clicked', () => {
      const mockSetShowAlert = jest.fn();
      render(<PopupAlert setShowAlert={mockSetShowAlert} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockSetShowAlert).toHaveBeenCalledWith(false);
    });
  });

  describe('Rerun button', () => {
    test('is enabled when permissions and ids are valid', () => {
      const selectedIds = [101, 102, 103];
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={selectedIds}
            failedCount={1}
            jobID={jobID}
          />
        </Provider>
      );

      const rerunLink = screen.getByRole('link', { name: /rerun/i });
      expect(rerunLink).toBeEnabled();

      const expectedSearchParams = new URLSearchParams();
      selectedIds.forEach(id => expectedSearchParams.append('host_ids[]', id));
      const expectedHref = `foreman/job_invocations/${jobID}/rerun?${expectedSearchParams.toString()}`;

      expect(rerunLink).toHaveAttribute('href', expectedHref);
    });
  });
});
