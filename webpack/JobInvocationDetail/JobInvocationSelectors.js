/* eslint-disable camelcase */
import {
  selectAPIResponse,
  selectAPIStatus,
} from 'foremanReact/redux/API/APISelectors';
import { STATUS as APIStatus } from 'foremanReact/constants';
import {
  JOB_INVOCATION_KEY,
  GET_TASK,
  GET_TEMPLATE_INVOCATION,
  LIST_TEMPLATE_INVOCATIONS,
  CURRENT_PERMISSIONS,
} from './JobInvocationConstants';

export const selectItems = state =>
  selectAPIResponse(state, JOB_INVOCATION_KEY);

export const selectTask = state => selectAPIResponse(state, GET_TASK);

export const selectTaskCancelable = state =>
  selectTask(state).available_actions?.cancellable || false;

export const selectTemplateInvocation = hostID => state =>
  selectAPIResponse(state, `${GET_TEMPLATE_INVOCATION}_${hostID}`);

export const selectTemplateInvocationStatus = hostID => state =>
  selectAPIStatus(state, `${GET_TEMPLATE_INVOCATION}_${hostID}`);

export const selectTemplateInvocationList = state =>
  selectAPIResponse(state, LIST_TEMPLATE_INVOCATIONS)
    ?.template_invocations_task_by_hosts;

export const selectCurrentPermisions = state =>
  selectAPIResponse(state, CURRENT_PERMISSIONS);

export const selectHasPermission = permissionRequired => state => {
  const status = selectAPIStatus(state, CURRENT_PERMISSIONS);
  const selectCurrentPermissions = selectCurrentPermisions(state)?.results;
  return status === APIStatus.RESOLVED
    ? selectCurrentPermissions?.some(
        permission => permission.name === permissionRequired
      )
    : false;
};

export const formatForemanApiError = apiFailureResponse => {
  if (!apiFailureResponse) {
    return null;
  }
  const { response, message } = apiFailureResponse;
  const err = response?.data?.error;
  if (err) {
    if (Array.isArray(err.full_messages) && err.full_messages.length) {
      return err.full_messages.join(' ');
    }
    if (typeof err.details === 'string' && err.details.trim()) {
      return err.details.trim();
    }
    if (
      Array.isArray(err.missing_permissions) &&
      err.missing_permissions.length
    ) {
      return err.missing_permissions.join(', ');
    }
    if (typeof err.message === 'string' && err.message) {
      return err.message;
    }
    if (typeof err === 'string') {
      return err;
    }
  }
  if (typeof response?.data?.message === 'string') {
    return response.data.message;
  }
  if (message) {
    return message;
  }
  return null;
};
