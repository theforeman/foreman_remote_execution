import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import {
  JOB_INVOCATION_KEY,
  GET_TASK,
  GET_TEMPLATE_INVOCATION,
} from './JobInvocationConstants';

export const selectItems = state =>
  selectAPIResponse(state, JOB_INVOCATION_KEY);

export const selectTask = state => selectAPIResponse(state, GET_TASK);

export const selectTaskCancelable = state =>
  selectTask(state).available_actions?.cancellable || false;

export const selectTemplateInvocation = state =>
  selectAPIResponse(state, GET_TEMPLATE_INVOCATION);
