/* eslint-disable camelcase */
import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useForemanHostDetailsPageUrl } from 'foremanReact/Root/Context/ForemanContext';
import JobStatusIcon from '../react_app/components/RecentJobsCard/JobStatusIcon';

export const JOB_INVOCATION_KEY = 'JOB_INVOCATION_KEY';
export const CURRENT_PERMISSIONS = 'CURRENT_PERMISSIONS';
export const UPDATE_JOB = 'UPDATE_JOB';
export const CANCEL_JOB = 'CANCEL_JOB';
export const GET_TASK = 'GET_TASK';
export const GET_TEMPLATE_INVOCATIONS = 'GET_TEMPLATE_INVOCATIONS';
export const CHANGE_ENABLED_RECURRING_LOGIC = 'CHANGE_ENABLED_RECURRING_LOGIC';
export const CANCEL_RECURRING_LOGIC = 'CANCEL_RECURRING_LOGIC';
export const GET_REPORT_TEMPLATES = 'GET_REPORT_TEMPLATES';
export const GET_REPORT_TEMPLATE_INPUTS = 'GET_REPORT_TEMPLATE_INPUTS';
export const JOB_INVOCATION_HOSTS = 'JOB_INVOCATION_HOSTS';
export const GET_TEMPLATE_INVOCATION = 'GET_TEMPLATE_INVOCATION';
export const DIRECT_OPEN_HOST_LIMIT = 3;
export const ALL_JOB_HOSTS = 'ALL_JOB_HOSTS';
export const AWAITING_STATUS_FILTER = '(job_invocation.result = N/A)';
export const currentPermissionsUrl = foremanUrl(
  '/api/v2/permissions/current_permissions'
);

export const showTemplateInvocationUrl = (hostID, jobID) =>
  `/show_template_invocation_by_host/${hostID}/job_invocation/${jobID}`;
export const LIST_TEMPLATE_INVOCATIONS = 'LIST_TEMPLATE_INVOCATIONS';

export const templateInvocationPageUrl = (hostID, jobID) =>
  `/job_invocations_detail/${jobID}/host_invocation/${hostID}`;

export const jobInvocationDetailsUrl = id => `/job_invocations/${id}`;

export const STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const STATUS_UPPERCASE = {
  RESOLVED: 'RESOLVED',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
};

export const STATUS_TITLES = {
  ALL_STATUSES: { id: 'all_statuses', title: __('All statuses') },
  SUCCESS: { id: 'success', title: __('Succeeded') },
  FAILED: { id: 'failed', title: __('Failed') },
  PENDING: { id: 'pending', title: __('In Progress') },
  CANCELLED: { id: 'cancelled', title: __('Cancelled') },
  NOT_STARTED: { id: 'N/A', title: __('Scheduled') },
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

const Columns = () => {
  const getColumnsStatus = ({ hostJobStatus }) => {
    switch (hostJobStatus) {
      case 'success':
        return { title: __('Succeeded'), status: 0 };
      case 'error':
        return { title: __('Failed'), status: 1 };
      case 'planned':
        return { title: __('Scheduled'), status: 2 };
      case 'running':
        return { title: __('Pending'), status: 3 };
      case 'pending':
        return { title: __('Pending'), status: 3 };
      case 'cancelled':
        return { title: __('Cancelled'), status: 4 };
      case 'N/A':
        return { title: __('Awaiting start'), status: 5 };
      default:
        return { title: hostJobStatus, status: 6 };
    }
  };
  const hostDetailsPageUrl = useForemanHostDetailsPageUrl();

  return {
    expand: {
      title: ' ',
      weight: 0,
      wrapper: () => null,
    },
    name: {
      title: __('Name'),
      wrapper: ({ name }) => (
        <a href={`${hostDetailsPageUrl}${name}`}>{name}</a>
      ),
      isSorted: true,
      weight: 1,
    },
    hostgroup: {
      title: __('Host group'),
      wrapper: ({ hostgroup_id, hostgroup_name }) => (
        <a href={`/hostgroups/${hostgroup_id}/edit`}>{hostgroup_name}</a>
      ),
      isSorted: true,
      weight: 2,
    },
    os: {
      title: __('OS'),
      wrapper: ({ operatingsystem_id, operatingsystem_name }) => (
        <a href={`/operatingsystems/${operatingsystem_id}/edit`}>
          {operatingsystem_name}
        </a>
      ),
      isSorted: true,
      weight: 3,
    },
    smart_proxy: {
      title: __('Smart proxy'),
      wrapper: ({ smart_proxy_name, smart_proxy_id }) => (
        <a href={`/smart_proxies/${smart_proxy_id}`}>{smart_proxy_name}</a>
      ),
      isSorted: true,
      weight: 4,
    },
    status: {
      title: __('Status'),
      wrapper: ({ job_status }) => {
        const { title, status } = getColumnsStatus({
          hostJobStatus: job_status,
        });
        return (
          <JobStatusIcon status={status}>
            {title || __('Unknown')}
          </JobStatusIcon>
        );
      },
      weight: 5,
    },
  };
};

export default Columns;

const STATIC_TYPE = 'static_query';
const DYNAMIC_TYPE = 'dynamic_query';
export const TARGETING_TYPES = {
  [STATIC_TYPE]: __('Static Query'),
  [DYNAMIC_TYPE]: __('Dynamic Query'),
};
