import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import HostActions from './HostActions';

const fixtures = {
  'renders HostActions with no actions': {
    actions: undefined,
  },
  'renders HostActions with 0 actions': {
    actions: [],
  },
  'renders HostActions with one action': {
    actions: [{ path: '/1', name: 'action one' }],
  },
  'renders HostActions with more actions': {
    actions: [{ path: '/1', name: 'action one' },
      { path: '/2', name: 'action two' }],
  },
};
describe('HostActions', () =>
  testComponentSnapshotsWithFixtures(HostActions, fixtures));
