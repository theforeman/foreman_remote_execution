// eslint-disable-next-line import/no-extraneous-dependencies
import API from 'foremanReact/API';

import {
  JOB_INVOCATIONS_GET_JOB_INVOCATIONS,
  JOB_INVOCATIONS_POLLING_STARTED,
} from '../../consts';

const defaultJobInvocationsPollingInterval = 10000;
const jobInvocationsInterval = process.env.JOB_INVOCATIONS_POLLING ||
  defaultJobInvocationsPollingInterval;

const getJobInvocations = url => (dispatch) => {
  function onGetJobInvocationsSuccess({ data }) {
    dispatch({
      type: JOB_INVOCATIONS_GET_JOB_INVOCATIONS,
      payload: {
        jobInvocations: data,
      },
    });
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
        jobInvocationsInterval,
      );
    }
  }

  const isDocumentVisible =
    document.visibilityState === 'visible' ||
    document.visibilityState === 'prerender';

  if (isDocumentVisible) {
    API.get(url)
      .then(onGetJobInvocationsSuccess)
      .catch(onGetJobInvocationsFailed)
      .then(triggerPolling);
  } else {
    // document is not visible, keep polling without api call
    triggerPolling();
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
