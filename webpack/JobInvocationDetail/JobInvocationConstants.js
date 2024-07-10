/* eslint-disable camelcase */
import React from 'react';
import { foremanUrl } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';

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

export const DATE_OPTIONS = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
};

const getColumnsStatus = name => {
  switch (name) {
    case 'success':
      return { title: __('Succeeded'), status: 0 };
    case 'error':
      return { title: __('Failed'), status: 1 };
    default:
      return { title: __('Unknown'), status: 2 };
  }
};

export const columns = {
  name: {
    title: __('Name'),
    wrapper: ({ name }) => <a href={`/new/hosts/${name}`}>{name}</a>,
    weight: 1,
  },
  groups: {
    title: __('Host group'),
    wrapper: ({ hostgroup_id, hostgroup_name }) => (
      <a href={`/hostgroups/${hostgroup_id}/edit`}>{hostgroup_name}</a>
    ),
    weight: 2,
  },
  os: {
    title: __('OS'),
    wrapper: ({ operatingsystem_id, operatingsystem_name }) => (
      <a href={`/operatingsystems/${operatingsystem_id}/edit`}>
        {operatingsystem_name}
      </a>
    ),
    weight: 3,
  },
  smart_proxy: {
    title: __('Smart proxy'),
    wrapper: ({ smart_proxy_name, smart_proxy_id }) => (
      <a href={`/smart_proxies/${smart_proxy_id}`}>{smart_proxy_name}</a>
    ),
    weight: 4,
  },
  status: {
    title: __('Status'),
    tableTitle: job_status => getColumnsStatus(job_status).title,
    status: job_status => getColumnsStatus(job_status).status,
    weight: 5,
  },
};
