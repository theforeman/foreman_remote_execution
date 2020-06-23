import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';

import {
  selectItems,
  selectAutoRefresh,
  selectApiStatus,
  selectTotalHosts,
  selectIntervalExists,
} from '../TargetingHostsSelectors';

const state = {
  hosts: [],
  autoRefresh: 'true',
  total_hosts: 0,
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
