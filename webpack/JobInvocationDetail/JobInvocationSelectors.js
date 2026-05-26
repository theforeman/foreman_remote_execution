/* eslint-disable camelcase */
import {
  selectAPIResponse,
  selectAPIStatus,
} from 'foremanReact/redux/API/APISelectors';
import {
  JOB_INVOCATION_KEY,
  GET_TEMPLATE_INVOCATION,
  LIST_TEMPLATE_INVOCATIONS,
} from './JobInvocationConstants';

export const selectItems = state =>
  selectAPIResponse(state, JOB_INVOCATION_KEY);

export const selectTaskCancelable = state =>
  selectItems(state).task?.cancellable || false;

export const selectTemplateInvocation = hostID => state =>
  selectAPIResponse(state, `${GET_TEMPLATE_INVOCATION}_${hostID}`);

export const selectTemplateInvocationStatus = hostID => state =>
  selectAPIStatus(state, `${GET_TEMPLATE_INVOCATION}_${hostID}`);

export const selectTemplateInvocationList = state =>
  selectAPIResponse(state, LIST_TEMPLATE_INVOCATIONS)
    ?.template_invocations_task_by_hosts;
