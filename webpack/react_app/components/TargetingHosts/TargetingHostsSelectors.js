import {
  selectAPIStatus,
  selectAPIResponse,
} from 'foremanReact/redux/API/APISelectors';
import { TARGETING_HOSTS } from './TargetingHostsConsts';

export const selectItems = state =>
  selectAPIResponse(state, TARGETING_HOSTS).hosts || [];

export const selectAutoRefresh = state =>
  selectAPIResponse(state, TARGETING_HOSTS).autoRefresh;
export const selectStatus = state => selectAPIStatus(state, TARGETING_HOSTS);
