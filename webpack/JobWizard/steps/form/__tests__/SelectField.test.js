import React from 'react';
import * as patternfly from '@patternfly/react-core';
import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { SelectField } from '../SelectField';

jest.spyOn(patternfly, 'Select');
jest.spyOn(patternfly, 'SelectOption');
patternfly.Select.mockImplementation(props => <div>{props}</div>);
patternfly.SelectOption.mockImplementation(props => <div>{props}</div>);
const fixtures = {
  'renders with props': {
    label: 'grouped select',
    fieldId: 'field-id',
    options: ['Commands'],
    value: 'Commands',
    setValue: jest.fn(),
  },
};

describe('SelectField', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(SelectField, fixtures));
});
