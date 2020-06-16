import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import HostStatus from '../components/HostStatus';

const fixtures = {
  'renders HostStatus': {
    status: 'success',
  },
};
describe('HostStatus', () =>
  testComponentSnapshotsWithFixtures(HostStatus, fixtures));
