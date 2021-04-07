import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import * as patternfly from '@patternfly/react-core';
import { testComponentSnapshotsWithFixtures, mount } from '@theforeman/test';
import JobWizardPage from '../index';
import { JobWizard } from '../JobWizard';

jest.spyOn(patternfly, 'Wizard');
patternfly.Wizard.mockImplementation(props => <div>{props.navAriaLabel}</div>);
const mockStore = configureMockStore();
const store = mockStore({});
const fixtures = {
  'renders ': {},
};
describe('JobWizardPage rendering', () =>
  testComponentSnapshotsWithFixtures(JobWizardPage, fixtures));

describe('JobWizard rendering', () => {
  describe('render', () => {
    const component = mount(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
  describe('update advanced fields', () => {});
});
