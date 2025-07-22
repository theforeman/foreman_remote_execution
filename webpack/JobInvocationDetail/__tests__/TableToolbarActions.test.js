import '@testing-library/jest-dom/extend-expect';
import * as ReactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { addToast } from 'foremanReact/components/ToastsList';
import configureStore from 'redux-mock-store';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { APIActions } from 'foremanReact/redux/API';
import { CheckboxesActions } from '../CheckboxesActions';
import { PopupAlert } from '../OpenAllInvocationsModal';

jest.mock('foremanReact/common/hooks/API/APIHooks');
jest.mock('../JobInvocationConstants', () => ({
  ...jest.requireActual('../JobInvocationConstants'),
  templateInvocationPageUrl: jest.fn(
    (hostId, jobId) => `url/${hostId}/${jobId}`
  ),
  DIRECT_OPEN_HOST_LIMIT: 3,
}));

jest.mock('foremanReact/components/ToastsList', () => ({
  addToast: jest.fn(payload => ({ type: 'ADD_TOAST', payload })),
}));
jest.mock('foremanReact/redux/API', () => ({
  APIActions: {
    post: jest.fn(payload => ({ type: 'API_POST', payload })),
  },
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
  let mockDispatch;

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
    useAPI.mockClear();
    useAPI.mockReturnValue({
      response: null,
      status: 'initial',
    });

    mockDispatch = jest.fn();
    jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    addToast.mockClear();
    APIActions.post.mockClear();
  });

  afterEach(() => {
    openSpy.mockRestore();
    jest.restoreAllMocks();
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
      fireEvent.click(
        screen.getByLabelText(/open all template invocations in new tab/i)
      );
      expect(
        screen.getByRole('heading', {
          name: /open all %s invocations in new tabs \+ selected/i,
        })
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
      fireEvent.click(
        screen.getByLabelText(/open all template invocations in new tab/i)
      );
      expect(
        screen.getByText(/Popups are blocked by your browser/)
      ).toBeInTheDocument();
    });
  });

  describe('Opening failed in new tabs', () => {
    test('opens links when results length is less than or equal to 3', async () => {
      const failedHosts = [{ id: 301 }, { id: 302 }];
      useAPI.mockReturnValue({
        response: { results: failedHosts },
        status: 'success',
      });
      render(
        <Provider store={store}>
          <CheckboxesActions selectedIds={[]} failedCount={2} jobID={jobID} />
        </Provider>
      );
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(screen.getByText(/open all failed runs/i));
      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledTimes(failedHosts.length);
      });
    });

    test('shows modal when results length is greater than 3', () => {
      render(
        <Provider store={store}>
          <CheckboxesActions selectedIds={[]} failedCount={4} jobID={jobID} />
        </Provider>
      );
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(screen.getByText(/open all failed runs/i));
      expect(
        screen.getByRole('heading', {
          name: /open all %s invocations in new tabs \+ failed/i,
        })
      ).toBeInTheDocument();
    });

    test('calls useApi with skip: true when failedCount is 0', () => {
      render(
        <Provider store={store}>
          <CheckboxesActions selectedIds={[]} failedCount={0} jobID={jobID} />
        </Provider>
      );
      expect(useAPI).toHaveBeenCalledWith(
        'get',
        `foreman/api/job_invocations/${jobID}/hosts`,
        expect.objectContaining({
          skip: true,
        })
      );
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

  describe('Cancel/Abort selected', () => {
    const defaultProps = {
      jobID: '42',
      selectedIds: [1, 2],
      failedCount: 0,
      bulkParams: 'id ^ (1, 2)',
      filter: '',
    };

    const mockEnabledState = () => {
      const useSelectorMock = jest.spyOn(ReactRedux, 'useSelector');
      useSelectorMock.mockReturnValueOnce(true); // isTaskCancelable
      useSelectorMock.mockReturnValueOnce({
        execute_jobs: true,
        cancel_job_invocations: true,
      });
    };

    test('enables cancel and abort buttons when conditions are met', async () => {
      mockEnabledState();
      render(<CheckboxesActions {...defaultProps} />);
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));

      expect(
        await screen.findByRole('menuitem', { name: 'Cancel selected' })
      ).toBeEnabled();
      expect(
        await screen.findByRole('menuitem', { name: 'Abort selected' })
      ).toBeEnabled();
    });

    test('disables buttons when no hosts are selected', async () => {
      mockEnabledState();
      render(<CheckboxesActions {...defaultProps} selectedIds={[]} />);
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));

      expect(
        await screen.findByRole('menuitem', { name: 'Cancel selected' })
      ).toBeDisabled();
    });

    test('disables buttons when user lacks cancel permissions', async () => {
      const useSelectorMock = jest.spyOn(ReactRedux, 'useSelector');
      useSelectorMock.mockReturnValueOnce(true); // isTaskCancelable
      useSelectorMock.mockReturnValueOnce({ cancel_job_invocations: false });

      render(<CheckboxesActions {...defaultProps} />);
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));

      expect(
        await screen.findByRole('menuitem', { name: 'Cancel selected' })
      ).toBeDisabled();
    });

    test('disables buttons when the job task is not cancellable', async () => {
      const useSelectorMock = jest.spyOn(ReactRedux, 'useSelector');
      useSelectorMock.mockReturnValueOnce(false); // isTaskCancelable
      useSelectorMock.mockReturnValueOnce({ cancel_job_invocations: true });

      render(<CheckboxesActions {...defaultProps} />);
      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));

      expect(
        await screen.findByRole('menuitem', { name: 'Cancel selected' })
      ).toBeDisabled();
    });

    test('dispatches cancel action with correct params on "Cancel selected" click', async () => {
      mockEnabledState();
      const props = { ...defaultProps, filter: 'failed' };
      render(<CheckboxesActions {...props} />);

      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(
        await screen.findByRole('menuitem', { name: 'Cancel selected' })
      );

      expect(addToast).toHaveBeenCalled();
      expect(APIActions.post).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledTimes(2);

      const dispatchedApiActionPayload = APIActions.post.mock.calls[0][0];
      expect(dispatchedApiActionPayload).toMatchObject({
        url: `/api/v2/job_invocations/42/cancel`,
        params: {
          search: `${props.bulkParams} and job_invocation.result = ${props.filter}`,
          force: false,
        },
      });
    });

    test('dispatches abort action with correct params on "Abort selected" click', async () => {
      mockEnabledState();
      render(<CheckboxesActions {...defaultProps} />);

      fireEvent.click(screen.getByLabelText(/actions dropdown toggle/i));
      fireEvent.click(
        await screen.findByRole('menuitem', { name: 'Abort selected' })
      );

      expect(addToast).toHaveBeenCalled();
      expect(APIActions.post).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledTimes(2);

      const dispatchedApiActionPayload = APIActions.post.mock.calls[0][0];
      expect(dispatchedApiActionPayload).toMatchObject({
        url: `/api/v2/job_invocations/42/cancel`,
        params: {
          search: defaultProps.bulkParams,
          force: true,
        },
      });
    });
  });
});
