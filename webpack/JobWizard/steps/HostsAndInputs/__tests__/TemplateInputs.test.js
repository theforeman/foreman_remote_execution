import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { TemplateInputs } from '../TemplateInputs';

const fixtures = {
  'renders with text props': {
    inputs: [
      {
        name: 'plain adv hidden',
        required: true,
        description: 'some Description',
        options: '',
        advanced: false,
        value_type: 'plain',
        resource_type: 'ansible_roles',
        default: 'Default val',
        hidden_value: true,
      },
    ],
    value: {},
    setValue: jest.fn(),
  },

  'renders without simple inputs': {
    inputs: [
      {
        name: 'plain adv hidden',
        required: true,
        description: 'some Description',
        options: '',
        advanced: true,
        value_type: 'plain',
        resource_type: 'ansible_roles',
        default: 'Default val',
        hidden_value: true,
      },],
    value: {},
    setValue: jest.fn(),
  },
};

describe('TemplateInputs', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TemplateInputs, fixtures));
});
