import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';
import { APIActions } from 'foremanReact/redux/API';
import {
  CANCEL_JOB,
  CANCEL_RECURRING_LOGIC,
  CHANGE_ENABLED_RECURRING_LOGIC,
  JOB_INVOCATION_KEY,
  STATUS,
  AUTO_REFRESH_INTERVAL_MS,
} from './JobInvocationConstants';

export const isJobFinished = statusLabel =>
  statusLabel === STATUS.FAILED ||
  statusLabel === STATUS.SUCCEEDED ||
  statusLabel === STATUS.CANCELLED;

const createPollState = cancel => ({ timeoutId: null, cancel });

export const getJobInvocation = (url, pollTimeoutRef) => dispatch => {
  let cancelled = false;
  let isFirstCall = true;

  const poll = () => {
    if (cancelled) return;
    const params = { include_hosts: false };
    if (isFirstCall) {
      params.include_permissions = true;
      isFirstCall = false;
    }

    dispatch(
      APIActions.get({
        key: JOB_INVOCATION_KEY,
        params,
        url,
        handleSuccess: ({ data }) => {
          if (cancelled) return;
          // eslint-disable-next-line camelcase
          pollTimeoutRef.current.timeoutId = isJobFinished(data?.status_label)
            ? null
            : setTimeout(poll, AUTO_REFRESH_INTERVAL_MS);
        },
        handleError: () => {
          if (cancelled) return;
          pollTimeoutRef.current.timeoutId = null;
        },
        errorToast: (_error, parsedMessage) =>
          parsedMessage || __('Unknown error.'),
      })
    );
  };

  stopJobInvocationPolling(pollTimeoutRef);
  pollTimeoutRef.current = createPollState(() => {
    cancelled = true;
  });

  poll();
};

export const stopJobInvocationPolling = pollTimeoutRef => {
  clearTimeout(pollTimeoutRef.current.timeoutId);
  pollTimeoutRef.current.cancel();
  pollTimeoutRef.current = createPollState(() => {});
};

export const cancelJob = (jobId, force) => dispatch => {
  const infoToast = () =>
    force
      ? sprintf(__('Trying to abort the job %s.'), jobId)
      : sprintf(__('Trying to cancel the job %s.'), jobId);
  const url = force
    ? `/job_invocations/${jobId}/cancel?force=true`
    : `/job_invocations/${jobId}/cancel`;

  dispatch(
    APIActions.post({
      url,
      key: CANCEL_JOB,
      errorToast: (_error, parsedMessage) =>
        force
          ? sprintf(
              __('Could not abort the job %s: %s'),
              jobId,
              parsedMessage || __('Unknown error.')
            )
          : sprintf(
              __('Could not cancel the job %s: %s'),
              jobId,
              parsedMessage || __('Unknown error.')
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

export const enableRecurringLogic = (recurrenceId, enabled) => dispatch => {
  const successToast = () =>
    enabled
      ? sprintf(__('Recurring logic %s disabled successfully.'), recurrenceId)
      : sprintf(__('Recurring logic %s enabled successfully.'), recurrenceId);
  const url = `/foreman_tasks/api/recurring_logics/${recurrenceId}`;
  dispatch(
    APIActions.put({
      url,
      key: CHANGE_ENABLED_RECURRING_LOGIC,
      params: { recurring_logic: { enabled: !enabled } },
      successToast,
      errorToast: (_error, parsedMessage) =>
        enabled
          ? sprintf(
              __('Could not disable recurring logic %s: %s'),
              recurrenceId,
              parsedMessage || __('Unknown error.')
            )
          : sprintf(
              __('Could not enable recurring logic %s: %s'),
              recurrenceId,
              parsedMessage || __('Unknown error.')
            ),
    })
  );
};

export const cancelRecurringLogic = recurrenceId => dispatch => {
  const successToast = () =>
    sprintf(__('Recurring logic %s cancelled successfully.'), recurrenceId);
  const url = `/foreman_tasks/recurring_logics/${recurrenceId}/cancel`;
  dispatch(
    APIActions.post({
      url,
      key: CANCEL_RECURRING_LOGIC,
      successToast,
      errorToast: (_error, parsedMessage) =>
        sprintf(
          __('Could not cancel recurring logic %s: %s'),
          recurrenceId,
          parsedMessage || __('Unknown error.')
        ),
    })
  );
};
