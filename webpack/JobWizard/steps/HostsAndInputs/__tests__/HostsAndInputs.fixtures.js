import configureMockStore from 'redux-mock-store';
import {
  HOSTS,
  HOST_COLLECTIONS,
  HOST_GROUPS,
} from '../../../JobWizardConstants';

const mockStore = configureMockStore([]);
export const hostsStore = mockStore({
  [HOSTS]: {
    subtotal: 3,
    results: [{ name: 'host1' }, { name: 'host2' }, { name: 'host3' }],
  },
  [HOST_COLLECTIONS]: {
    subtotal: 2,
    results: [{ name: 'host_collection1' }, { name: 'host_collection2' }],
  },
  [HOST_GROUPS]: {
    subtotal: 4,
    results: [
      { name: 'host_group1' },
      { name: 'host_group2' },
      { name: 'host_group3' },
      { name: 'host_group4' },
    ],
  },
});
