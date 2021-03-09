import React from 'react';
import * as patternfly from '@patternfly/react-core';
import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import JobWizardPage from '../index';

jest.spyOn(patternfly, 'Wizard');
patternfly.Wizard.mockImplementation(props => <div>{props.navAriaLabel}</div>);
const mockDate = new Date(1466424490000);
const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

afterAll(() => {
  spy.mockRestore();
});

const fixtures = {
  'renders ': {},
};
describe('JobWizardPage rendering', () =>
  testComponentSnapshotsWithFixtures(JobWizardPage, fixtures));
