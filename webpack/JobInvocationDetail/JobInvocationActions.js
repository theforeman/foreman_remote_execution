import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';
import { APIActions, get } from 'foremanReact/redux/API';
import {
  CANCEL_JOB,
  CANCEL_RECURRING_LOGIC,
  CHANGE_ENABLED_RECURRING_LOGIC,
  JOB_INVOCATION_KEY,
} from './JobInvocationConstants';

let pollTimeoutId = null;

const scheduleNextPoll = (dispatch, url) => {
  pollTimeoutId = setTimeout(() => fetchJobInvocation(dispatch, url), 1000);
};

const fetchJobInvocation = (dispatch, url, params = {}) => {
  dispatch(
    get({
      key: JOB_INVOCATION_KEY,
      params,
      url,
      handleSuccess: () => scheduleNextPoll(dispatch, url),
      handleError: () => {
        pollTimeoutId = null;
      },
      errorToast: ({ response }) =>
        // eslint-disable-next-line camelcase
        response?.data?.error?.full_messages?.[0] ||
        // eslint-disable-next-line camelcase
        response?.data?.error?.full_messages ||
        response?.data?.error?.message ||
        'Error',
    })
  );
};

export const getJobInvocation = url => dispatch => {
  stopJobInvocationPolling();
  fetchJobInvocation(dispatch, url, { include_permissions: true });
};

export const stopJobInvocationPolling = () => {
  if (pollTimeoutId !== null) {
    clearTimeout(pollTimeoutId);
    pollTimeoutId = null;
  }
};

export const cancelJob = (jobId, force) => dispatch => {
  const infoToast = () =>
    force
      ? sprintf(__('Trying to abort the job %s.'), jobId)
      : sprintf(__('Trying to cancel the job %s.'), jobId);
  const errorToast = response =>
    force
      ? sprintf(__(`Could not abort the job %s: ${response}`), jobId)
      : sprintf(__(`Could not cancel the job %s: ${response}`), jobId);
  const url = force
    ? `/job_invocations/${jobId}/cancel?force=true`
    : `/job_invocations/${jobId}/cancel`;

  dispatch(
    APIActions.post({
      url,
      key: CANCEL_JOB,
      errorToast: ({ response }) =>
        errorToast(
          // eslint-disable-next-line camelcase
          response?.data?.error?.full_messages ||
            response?.data?.error?.message ||
            'Unknown error.'
        ),
      handleSuccess: () => {
        dispatch(
          addToast({
            key: `cancel-job-error`,
            type: 'info',
            message: infoToast(),
          })
        );
      },
    })
  );
};

export const enableRecurringLogic = (
  recurrenceId,
  enabled,
  jobId
) => dispatch => {
  const successToast = () =>
    enabled
      ? sprintf(__('Recurring logic %s disabled successfully.'), recurrenceId)
      : sprintf(__('Recurring logic %s enabled successfully.'), recurrenceId);
  const errorToast = response =>
    enabled
      ? sprintf(
          __(`Could not disable recurring logic %s: ${response}`),
          recurrenceId
        )
      : sprintf(
          __(`Could not enable recurring logic %s: ${response}`),
          recurrenceId
        );
  const url = `/foreman_tasks/api/recurring_logics/${recurrenceId}`;
  dispatch(
    APIActions.put({
      url,
      key: CHANGE_ENABLED_RECURRING_LOGIC,
      params: { recurring_logic: { enabled: !enabled } },
      successToast,
      errorToast: ({ response }) =>
        errorToast(
          // eslint-disable-next-line camelcase
          response?.data?.error?.full_messages ||
            response?.data?.error?.message ||
            'Unknown error.'
        ),
    })
  );
};

export const cancelRecurringLogic = (recurrenceId, jobId) => dispatch => {
  const successToast = () =>
    sprintf(__('Recurring logic %s cancelled successfully.'), recurrenceId);
  const errorToast = response =>
    sprintf(
      __(`Could not cancel recurring logic %s: ${response}`),
      recurrenceId
    );
  const url = `/foreman_tasks/recurring_logics/${recurrenceId}/cancel`;
  dispatch(
    APIActions.post({
      url,
      key: CANCEL_RECURRING_LOGIC,
      successToast,
      errorToast: ({ response }) =>
        errorToast(
          // eslint-disable-next-line camelcase
          response?.data?.error?.full_messages ||
            response?.data?.error?.message ||
            'Unknown error.'
        ),
    })
  );
};
