import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import TargetingHostsPage from '../TargetingHostsPage';
import { TargetingHostsPageFixtures } from './fixtures';

describe('TargetingHostsPage', () =>
  testComponentSnapshotsWithFixtures(
    TargetingHostsPage,
    TargetingHostsPageFixtures
  ));
