import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';

export const JOB_TEMPLATES = 'JOB_TEMPLATES';
export const JOB_CATEGORIES = 'JOB_CATEGORIES';
export const JOB_TEMPLATE = 'JOB_TEMPLATE';
export const JOB_INVOCATION = 'JOB_INVOCATION';
export const templatesUrl = foremanUrl('/api/v2/job_templates');

export const repeatTypes = {
  noRepeat: __('Does not repeat'),
  cronline: __('Cronline'),
  monthly: __('Monthly'),
  weekly: __('Weekly'),
  daily: __('Daily'),
  hourly: __('Hourly'),
};

export const SCHEDULE_TYPES = {
  NOW: __('Immediate execution'),
  FUTURE: __('Future execution'),
  RECURRING: __('Recurring execution'),
};

export const WIZARD_TITLES = {
  categoryAndTemplate: __('Category and Template'),
  hostsAndInputs: __('Target hosts and inputs'),
  advanced: __('Advanced fields'),
  schedule: __('Schedule'),
  review: __('Review details'),
  typeOfExecution: __('Type of execution'),
};

export const initialScheduleState = {
  repeatType: repeatTypes.noRepeat,
  scheduleType: SCHEDULE_TYPES.NOW,
  repeatAmount: '',
  repeatData: {},
  startsAt: '',
  startsBefore: '',
  ends: '',
  isFuture: false,
  isNeverEnds: true,
  isTypeStatic: true,
  purpose: '',
};
export const HOSTS_API = 'HOSTS_API';
export const HOSTS = 'HOSTS';
export const HOST_COLLECTIONS = 'HOST_COLLECTIONS';
export const HOST_GROUPS = 'HOST_GROUPS';
export const hostMethods = {
  hosts: __('Hosts'),
  hostCollections: __('Host collections'),
  hostGroups: __('Host groups'),
  searchQuery: __('Search query'),
};

export const hostQuerySearchID = 'mainHostQuery';
export const hostsController = 'hosts';

export const dataName = {
  [HOSTS]: 'hosts',
  [HOST_GROUPS]: 'hostgroups',
};
export const HOSTS_TO_PREVIEW_AMOUNT = 20;

export const DEBOUNCE_API = 1500;
export const HOST_IDS = 'HOST_IDS';
export const REX_FEATURE = 'REX_FEATURE';

export const JOB_API_KEY = 'JOB_API_KEY';
