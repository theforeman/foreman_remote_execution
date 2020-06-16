import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import TargetingHosts from '../TargetingHosts';

const fixtures = {
  'renders TargetingHosts': {
    status: '',
    items: [
      {
        name: 'host',
        link: '/link',
        status: 'success',
        actions: [],
      },
    ],
  },
  'renders TargetingHosts with error': {
    status: 'ERROR',
    items: [
      {
        name: 'host',
        link: '/link',
        status: 'success',
        actions: [],
      },
    ],
  },
  'renders TargetingHosts with loading': {
    status: '',
    items: [],
  },
};

jest.mock('foremanReact/constants', () => ({
  STATUS: {
    ERROR: 'ERROR',
  },
}));

describe('ApiError', () =>
  testComponentSnapshotsWithFixtures(TargetingHosts, fixtures));
