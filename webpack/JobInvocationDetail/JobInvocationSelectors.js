import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import { JOB_INVOCATION_KEY, GET_TASK } from './JobInvocationConstants';

export const selectItems = state =>
  selectAPIResponse(state, JOB_INVOCATION_KEY);

export const selectTask = state => selectAPIResponse(state, GET_TASK);

export const selectTaskCancelable = state =>
  selectTask(state).available_actions?.cancellable || false;
