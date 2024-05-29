import { foremanUrl } from 'foremanReact/common/helpers';

export const JOB_INVOCATION_KEY = 'JOB_INVOCATION_KEY';
export const CURRENT_PERMISSIONS = 'CURRENT_PERMISSIONS';
export const UPDATE_JOB = 'UPDATE_JOB';
export const CANCEL_JOB = 'CANCEL_JOB';
export const GET_TASK = 'GET_TASK';
export const CHANGE_ENABLED_RECURRING_LOGIC = 'CHANGE_ENABLED_RECURRING_LOGIC';
export const CANCEL_RECURRING_LOGIC = 'CANCEL_RECURRING_LOGIC';
export const GET_REPORT_TEMPLATES = 'GET_REPORT_TEMPLATES';
export const GET_REPORT_TEMPLATE_INPUTS = 'GET_REPORT_TEMPLATE_INPUTS';
export const currentPermissionsUrl = foremanUrl(
  '/api/v2/permissions/current_permissions'
);

export const STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const DATE_OPTIONS = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
};
