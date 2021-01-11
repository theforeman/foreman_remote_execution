import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import RexInterface from '../RexInterface';

const fixtures = {
  renders: { isLoading: false, onChange: () => {} },
};

describe('RexInterface', () =>
  testComponentSnapshotsWithFixtures(RexInterface, fixtures));
