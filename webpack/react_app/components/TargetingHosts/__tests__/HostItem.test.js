import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import HostItem from '../components/HostItem';
import { HostItemFixtures } from './fixtures';

describe('HostItem', () =>
  testComponentSnapshotsWithFixtures(HostItem, HostItemFixtures));
