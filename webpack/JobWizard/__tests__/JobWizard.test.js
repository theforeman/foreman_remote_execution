import React from 'react';
import * as patternfly from '@patternfly/react-core';
import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import JobWizardPage from '../index';
import { JobWizard } from '../JobWizard';

jest.spyOn(patternfly, 'Wizard');
patternfly.Wizard.mockImplementation(props => <div>{props}</div>);
const fixtures = {
  'renders ': {},
};
describe('JobWizardPage', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(JobWizardPage, fixtures));
});

describe('JobWizard', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(JobWizard, fixtures));
});
