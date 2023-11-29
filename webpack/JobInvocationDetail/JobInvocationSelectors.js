import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import { JOB_INVOCATION_KEY } from './JobInvocationConstants';

export const selectItems = state =>
  selectAPIResponse(state, JOB_INVOCATION_KEY);
