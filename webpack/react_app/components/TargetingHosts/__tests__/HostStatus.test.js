import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import HostStatus from '../components/HostStatus';
import { HostStatusFixtures } from './fixtures';

describe('HostStatus', () =>
  testComponentSnapshotsWithFixtures(HostStatus, HostStatusFixtures));
