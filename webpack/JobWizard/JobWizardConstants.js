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
  starts: '',
  ends: '',
  isFuture: false,
  isNeverEnds: false,
};
