import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';

export const JOB_TEMPLATES = 'JOB_TEMPLATES';
export const JOB_CATEGORIES = 'JOB_CATEGORIES';
export const JOB_TEMPLATE = 'JOB_TEMPLATE';
export const templatesUrl = foremanUrl('/api/v2/job_templates');

export const repeatTypes = {
  noRepeat: __('Does not repeat'),
  cronline: __('Cronline'),
  monthly: __('Monthly'),
  weekly: __('Weekly'),
  daily: __('Daily'),
  hourly: __('Hourly'),
};

export const WIZARD_TITLES = {
  categoryAndTemplate: __('Category and Template'),
  hostsAndInputs: __('Target hosts and inputs'),
  advanced: __('Advanced Fields'),
  schedule: __('Schedule'),
  review: __('Review Details'),
};

export const initialScheduleState = {
  repeatType: repeatTypes.noRepeat,
  repeatAmount: '',
  repeatData: {},
  startsAt: '',
  startsBefore: '',
  ends: '',
  isFuture: false,
  isNeverEnds: false,
  isTypeStatic: true,
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

export const hostQuerySearchID = 'searchBar'; // until https://projects.theforeman.org/issues/33737 is used
export const hostsController = 'hosts';

export const dataName = {
  [HOSTS]: 'hosts',
  [HOST_GROUPS]: 'hostgroups',
};
export const HOSTS_TO_PREVIEW_AMOUNT = 20;

export const DEBOUNCE_HOST_COUNT = 700;
export const HOST_IDS = 'HOST_IDS';
