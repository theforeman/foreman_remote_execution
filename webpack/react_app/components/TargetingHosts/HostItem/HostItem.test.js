import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import HostItem from './HostItem';

const fixtures = {
  'renders HostItem': {
    host: {
      name: 'Host1',
      link: '/host1',
      status: 'success',
      actions: [],
    },
  },

};
describe('HostItem', () =>
  testComponentSnapshotsWithFixtures(HostItem, fixtures));
