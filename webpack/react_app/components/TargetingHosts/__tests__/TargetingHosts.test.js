import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import TargetingHosts from '../TargetingHosts';
import { TargetingHostsFixtures } from './fixtures';

describe('TargetingHosts', () =>
  testComponentSnapshotsWithFixtures(TargetingHosts, TargetingHostsFixtures));
