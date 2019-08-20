import Immutable from 'seamless-immutable';

export const initialState = Immutable({
  isPolling: false,
  jobInvocations: [],
  statuses: {},
});

export const pollingStarted = Immutable({
  isPolling: true,
  jobInvocations: [],
  statuses: {},
});

export const jobInvocationsPayload = Immutable({
  jobInvocations: {
    job_invocations: [
      [
        'Success',
        100,
        '#B7312D',
      ],
      [
        'Failed',
        20,
        '#B7312D',
      ],
      [
        'Pending',
        40,
        '#B7312D',
      ],
      [
        'Cancelled',
        0,
        '#B7312D',
      ],
    ],
    statuses: {
      cancelled: 0,
      failed: 0,
      pending: 0,
      success: 1,
    },
  },
});

export const jobInvocationsReceived = Immutable({
  isPolling: true,
  jobInvocations: [
    [
      'Success',
      100,
      '#B7312D',
    ],
    [
      'Failed',
      20,
      '#B7312D',
    ],
    [
      'Pending',
      40,
      '#B7312D',
    ],
    [
      'Cancelled',
      0,
      '#B7312D',
    ],
  ],
  statuses: {
    cancelled: 0,
    failed: 0,
    pending: 0,
    success: 1,
  },
});
