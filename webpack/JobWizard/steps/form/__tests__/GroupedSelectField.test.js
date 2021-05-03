import React from 'react';
import * as patternfly from '@patternfly/react-core';
import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { GroupedSelectField } from '../GroupedSelectField';

jest.spyOn(patternfly, 'Select');
jest.spyOn(patternfly, 'SelectOption');
patternfly.Select.mockImplementation(props => <div>{props}</div>);
patternfly.SelectOption.mockImplementation(props => <div>{props}</div>);

const fixtures = {
  'renders with props': {
    label: 'grouped select',
    fieldId: 'field-id',
    groups: [
      {
        groupLabel: 'Ansible',
        options: [
          {
            label: 'Ansible Roles - Ansible Default',
            value: 168,
          },
          {
            label: 'Ansible Roles - Install from git',
            value: 170,
          },
        ],
      },
    ],
    selected: 170,
    setSelected: jest.fn(),
  },
};

describe('GroupedSelectField', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(GroupedSelectField, fixtures));
});
