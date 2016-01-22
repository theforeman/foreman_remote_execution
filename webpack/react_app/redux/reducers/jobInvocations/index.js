import Immutable from 'seamless-immutable';

import {
  JOB_INVOCATIONS_GET_JOB_INVOCATIONS,
  JOB_INVOCATIONS_POLLING_STARTED,
  JOB_INVOCATIONS_JOB_FINISHED,
} from '../../consts';

const initialState = Immutable({
  isPolling: false,
  jobInvocations: [],
  statuses: [],
});

export default (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case JOB_INVOCATIONS_POLLING_STARTED:
      return state.set('isPolling', true);
    case JOB_INVOCATIONS_JOB_FINISHED:
      return state
        .set('isPolling', false)
        .set('jobInvocations', payload.jobInvocations.job_invocations)
        .set('statuses', payload.jobInvocations.statuses);
    case JOB_INVOCATIONS_GET_JOB_INVOCATIONS:
      return state
        .set('jobInvocations', payload.jobInvocations.job_invocations)
        .set('statuses', payload.jobInvocations.statuses);
    default:
      return state;
  }
};
