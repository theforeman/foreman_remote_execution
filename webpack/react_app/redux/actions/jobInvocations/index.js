// eslint-disable-next-line import/no-extraneous-dependencies
import API from 'foremanReact/API';

import {
  JOB_INVOCATIONS_GET_JOB_INVOCATIONS,
  JOB_INVOCATIONS_POLLING_STARTED,
  JOB_INVOCATIONS_JOB_FINISHED,
} from '../../consts';

const defaultJobInvocationsPollingInterval = 1000;
const jobInvocationsInterval =
  process.env.JOB_INVOCATIONS_POLLING || defaultJobInvocationsPollingInterval;

const getJobInvocations = url => async (dispatch, getState) => {
  function onGetJobInvocationsSuccess({ data }) {
    // If the job has finished, stop polling
    if (data.finished) {
      dispatch({
        type: JOB_INVOCATIONS_JOB_FINISHED,
        payload: {
          jobInvocations: data,
        },
      });
    } else {
      dispatch({
        type: JOB_INVOCATIONS_GET_JOB_INVOCATIONS,
        payload: {
          jobInvocations: data,
        },
      });
    }
  }

  function onGetJobInvocationsFailed(error) {
    if (error.response.status === 401) {
      window.location.replace('/users/login');
    }
  }

  function triggerPolling() {
    if (jobInvocationsInterval) {
      setTimeout(
        () => dispatch(getJobInvocations(url)),
        jobInvocationsInterval
      );
    }
  }

  const isDocumentVisible =
    document.visibilityState === 'visible' ||
    document.visibilityState === 'prerender';

  if (getState().foremanRemoteExecutionReducers.jobInvocations.isPolling) {
    if (isDocumentVisible) {
      try {
        const data = await API.get(url);
        onGetJobInvocationsSuccess(data);
      } catch (error) {
        onGetJobInvocationsFailed(error);
      } finally {
        triggerPolling();
      }
    } else {
      // document is not visible, keep polling without api call
      triggerPolling();
    }
  }
};

export const startJobInvocationsPolling = url => (dispatch, getState) => {
  if (getState().foremanRemoteExecutionReducers.jobInvocations.isPolling) {
    return;
  }
  dispatch({
    type: JOB_INVOCATIONS_POLLING_STARTED,
  });
  dispatch(getJobInvocations(url));
};

export const chartFilter = state => (dispatch, getState) => {
  const filter = state ? { 'job_invocation.result': state.toLowerCase() } : {};
  dispatch({
    type: 'JOB_INVOCATION_CHART_FILTER',
    payload: { filter },
  });
};
