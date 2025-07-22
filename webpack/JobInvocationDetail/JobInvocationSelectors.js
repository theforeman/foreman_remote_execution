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
