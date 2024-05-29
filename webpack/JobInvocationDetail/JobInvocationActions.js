import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { addToast } from 'foremanReact/components/ToastsList';
import { APIActions, get } from 'foremanReact/redux/API';
import {
  stopInterval,
  withInterval,
} from 'foremanReact/redux/middlewares/IntervalMiddleware';
import {
  CANCEL_JOB,
  CANCEL_RECURRING_LOGIC,
  CHANGE_ENABLED_RECURRING_LOGIC,
  GET_TASK,
  JOB_INVOCATION_KEY,
  UPDATE_JOB,
} from './JobInvocationConstants';

export const getData = url => dispatch => {
  const fetchData = withInterval(
    get({
      key: JOB_INVOCATION_KEY,
      params: { include_permissions: true },
      url,
      handleError: () => {
        dispatch(stopInterval(JOB_INVOCATION_KEY));
      },
    }),
    1000
  );

  dispatch(fetchData);
};

export const updateJob = jobId => dispatch => {
  const url = foremanUrl(`/api/job_invocations/${jobId}`);
  dispatch(
    APIActions.get({
      url,
      key: UPDATE_JOB,
    })
  );
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
        dispatch(updateJob(jobId));
      },
    })
  );
};

export const getTask = taskId => dispatch => {
  dispatch(
    get({
      key: GET_TASK,
      url: `/foreman_tasks/api/tasks/${taskId}`,
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
      handleSuccess: () => dispatch(updateJob(jobId)),
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
      handleSuccess: () => dispatch(updateJob(jobId)),
    })
  );
};
