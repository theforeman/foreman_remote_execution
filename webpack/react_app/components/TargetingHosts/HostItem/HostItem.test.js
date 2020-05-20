import React from 'react';
import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import HostItem from './HostItem';

const fixtures = {
  'renders HostItem': {
    name: 'Host1',
    link: '/host1',
    status: 'success',
    actions: [],
  },
};

jest.mock('foremanReact/components/common/ActionButtons/ActionButtons', () => ({
  ActionButtons: () => <div />,
}));

describe('HostItem', () =>
  testComponentSnapshotsWithFixtures(HostItem, fixtures));
