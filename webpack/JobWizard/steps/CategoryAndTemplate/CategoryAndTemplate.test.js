import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { CategoryAndTemplate } from './CategoryAndTemplate';

const baseProps = {
  setJobTemplate: jest.fn(),
  selectedTemplateID: 190,
  setCategory: jest.fn(),
};
const fixtures = {
  'renders with props': {
    ...baseProps,
    jobCategories: [
      'Commands',
      'Ansible Playbook',
      'Ansible Galaxy',
      'Ansible Roles Installation',
    ],
    jobTemplates: [
      {
        id: 190,
        name: 'ab Run Command - SSH Default clone',
        job_category: 'Commands',
        provider_type: 'SSH',
        snippet: false,
      },
      {
        id: 168,
        name: 'Ansible Roles - Ansible Default',
        job_category: 'Ansible Playbook',
        provider_type: 'Ansible',
        snippet: false,
      },
      {
        id: 170,
        name: 'Ansible Roles - Install from git',
        job_category: 'Ansible Roles Installation',
        provider_type: 'Ansible',
        snippet: false,
      },
    ],
    selectedCategory: 'I am a category',
  },
  'render with error': {
    ...baseProps,
    errors: { allTemplatesError: 'I have an error' },
  },
};

describe('CategoryAndTemplate', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(CategoryAndTemplate, fixtures));
});
