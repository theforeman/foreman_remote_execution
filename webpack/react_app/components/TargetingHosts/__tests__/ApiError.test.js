import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import ApiError from '../components/ApiError';

const fixtures = {
  'renders ApiError': {},
};

describe('ApiError', () =>
  testComponentSnapshotsWithFixtures(ApiError, fixtures));
