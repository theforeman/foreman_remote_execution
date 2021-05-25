import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';

import {
  selectItems,
  selectAutoRefresh,
  selectApiStatus,
  selectTotalHosts,
  selectIntervalExists,
} from '../TargetingHostsSelectors';

const state = {
  TARGETING_HOSTS: {
    status: 'RESOLVED',
    response: {
      hosts: [1, 2],
      total_hosts: 2,
      autoRefresh: 'true',
    },
  },
};

const fixtures = {
  'should return hosts': () => selectItems(state),
  'should return autoRefresh': () => selectAutoRefresh(state),
  'should return apiStatus': () => selectApiStatus(state),
  'should return totalHosts': () => selectTotalHosts(state),
  'should return intervalExists': () => selectIntervalExists(state),
};

describe('TargetingHostsSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
