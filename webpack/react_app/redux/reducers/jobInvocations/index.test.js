import {
  JOB_INVOCATIONS_GET_JOB_INVOCATIONS,
  JOB_INVOCATIONS_POLLING_STARTED,
} from '../../consts';

import {
  initialState,
  pollingStarted,
  jobInvocationsPayload,
  jobInvocationsReceived,
} from './index.fixtures';

import reducer from './index';

describe('job invocations chart reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('should return start polling given POLLING_STARTED', () => {
    expect(reducer(initialState, {
      type: JOB_INVOCATIONS_POLLING_STARTED,
    })).toEqual(pollingStarted);
  });
  it('should receive job invocations given GET_JOB_INVOCATIONS', () => {
    expect(reducer(pollingStarted, {
      type: JOB_INVOCATIONS_GET_JOB_INVOCATIONS,
      payload: jobInvocationsPayload,
    })).toEqual(jobInvocationsReceived);
  });
});
