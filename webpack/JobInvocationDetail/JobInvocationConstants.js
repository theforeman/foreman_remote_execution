/* eslint-disable camelcase */
import React from 'react';
import { foremanUrl } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanHostDetailsPageUrl } from 'foremanReact/Root/Context/ForemanContext';
import { STATUS as APIStatus } from 'foremanReact/constants';
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
export const currentPermissionsUrl = foremanUrl(
  '/api/v2/permissions/current_permissions'
);

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

export const hasPermission = (
  currentPermissions,
  permissionsStatus,
  permissionRequired
) =>
  permissionsStatus === APIStatus.RESOLVED
    ? currentPermissions?.some(
        permission => permission.name === permissionRequired
      )
    : false;

const Columns = () => {
  const getColumnsStatus = ({ hostJobStatus }) => {
    switch (hostJobStatus) {
      case 'success':
        return { title: __('Succeeded'), status: 0 };
      case 'error':
        return { title: __('Failed'), status: 1 };
      case 'planned':
        return { title: __('Scheduled'), status: 2 };
      case 'running' || 'pending':
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
