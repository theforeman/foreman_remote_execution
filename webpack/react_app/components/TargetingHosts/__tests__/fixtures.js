const items = [
  {
    name: 'host',
    link: '/link',
    status: 'success',
    actions: [],
  },
  {
    name: 'host2',
    link: '/link2',
    status: 'success',
    actions: [],
  },
];

export const HostItemFixtures = {
  renders: {
    name: 'Host1',
    link: '/host1',
    status: 'success',
    actions: [],
  },
};

export const HostStatusFixtures = {
  renders: {
    status: 'success',
  },
  'renders running status': {
    status: 'running',
  },
  'renders pending status': {
    status: 'pending',
  },
  'renders cancelled status': {
    status: 'cancelled',
  },
  'renders N/A status': {
    status: 'N/A',
  },
  'renders planned status': {
    status: 'planned',
  },
  'renders warning status': {
    status: 'warning',
  },
  'renders error status': {
    status: 'error',
  },
  'renders unknown status': {
    status: 'unknown_status',
  },
};

export const TargetingHostsFixtures = {
  renders: {
    apiStatus: 'RESOLVED',
    items,
  },
  'renders with error': {
    apiStatus: 'ERROR',
    items,
  },
  'renders with loading': {
    apiStatus: 'PENDING',
    items: [],
  },
};

export const TargetingHostsPageFixtures = {
  renders: {
    handleSearch: () => {},
    searchQuery: '',
    apiStatus: 'RESOLVED',
    items,
    totalHosts: 1,
    page: 1,
    handlePagination: () => {},
  },
};
