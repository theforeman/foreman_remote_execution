import { combineReducers } from 'redux';
import jobInvocations from './jobInvocations/';
import TargetingHosts from './TargetingHosts/';

export default combineReducers({
  jobInvocations,
  TargetingHosts,
});
