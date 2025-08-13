import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { CheckboxesActions } from '../CheckboxesActions';
import * as selectors from '../JobInvocationSelectors';
import { PopupAlert } from '../OpenAllInvocationsModal';

jest.mock('axios');
jest.mock('foremanReact/common/hooks/API/APIHooks');
jest.mock('../JobInvocationSelectors');

jest.mock('../JobInvocationConstants', () => ({
  ...jest.requireActual('../JobInvocationConstants'),
  templateInvocationPageUrl: jest.fn(
    (hostId, jobId) => `url/${hostId}/${jobId}`
  ),
  DIRECT_OPEN_HOST_LIMIT: 3,
}));

selectors.selectItems.mockImplementation(() => ({
  targeting: { search_query: 'name~*' },
}));
selectors.selectHasPermission.mockImplementation(() => () => true);
selectors.selectTaskCancelable.mockImplementation(() => true);

const mockStore = configureStore([]);
const store = mockStore({});

const allJobs = [
  {
    id: 1,
    job_status: 'error',
  },
  {
    id: 2,
    job_status: 'error',
  },
  {
    id: 3,
    job_status: 'error',
  },
  {
    id: 4,
    job_status: 'error',
  },
  {
    id: 5,
    job_status: 'error',
  },
];

describe('TableToolbarActions', () => {
  const jobID = '42';
  let openSpy;

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
    useAPI.mockClear();
    axios.post.mockResolvedValue({ data: {} });
    useAPI.mockReturnValue({
      response: null,
      status: 'initial',
    });
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
            jobID={jobID}
            allJobs={allJobs}
            setShowAlert={jest.fn()}
          />
        </Provider>
      );
      const openAllButton = screen.getByLabelText(
        /open all template invocations in new tab/i
      );
      fireEvent.click(openAllButton);
      expect(openSpy).toHaveBeenCalledTimes(selectedIds.length);
    });

    test('shows modal when results length is greater than 3', async () => {
      const selectedIds = [1, 2, 3, 4];
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={selectedIds}
            jobID={jobID}
            allJobs={allJobs}
            setShowAlert={jest.fn()}
          />
        </Provider>
      );
      fireEvent.click(
        screen.getByLabelText(/open all template invocations in new tab/i)
      );
      expect(
        await screen.findByRole('heading', {
          name: /open all.*invocations in new tabs \+ selected/i,
        })
      ).toBeInTheDocument();
    });

    test('shows alert when popups are blocked', async () => {
      openSpy.mockReturnValue(null);
      const selectedIds = [1, 2];
      const setShowMock = jest.fn();
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={selectedIds}
            jobID={jobID}
            allJobs={allJobs}
            setShowAlert={setShowMock}
          />
        </Provider>
      );
      fireEvent.click(
        screen.getByLabelText(/open all template invocations in new tab/i)
      );
      expect(setShowMock).toHaveBeenCalledWith(true);
    });
  });

  describe('Opening failed in new tabs', () => {
    test('opens links when results length is less than or equal to 3', async () => {
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={[]}
            jobID={jobID}
            allJobs={allJobs.slice(0, 2)}
            setShowAlert={jest.fn()}
          />
        </Provider>
      );
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(await screen.findByText(/open all failed runs/i));
      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledTimes(2);
      });
    });

    test('shows modal when results length is greater than 3', async () => {
      render(
        <Provider store={store}>
          <CheckboxesActions
            selectedIds={[]}
            jobID={jobID}
            allJobs={allJobs}
            setShowAlert={jest.fn()}
          />
        </Provider>
      );
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(await screen.findByText(/open all failed runs/i));
      expect(
        await screen.findByRole('heading', {
          name: /open all.*invocations in new tabs \+ failed/i,
        })
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
            bulkParams="(id ^ (101, 102, 103))"
            selectedIds={selectedIds}
            jobID={jobID}
            allJobs={allJobs}
            setShowAlert={jest.fn()}
          />
        </Provider>
      );
      const rerunLink = screen.getByRole('link', { name: /rerun/i });
      expect(rerunLink).toBeEnabled();
      const expectedHref = foremanUrl(
        `/job_invocations/42/rerun?search=(job_invocation.id = 42) AND ((id ^ (101, 102, 103)))`
      );
      expect(rerunLink).toHaveAttribute('href', expectedHref);
    });
  });
});
