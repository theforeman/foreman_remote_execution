import {
  selectAPIStatus,
  selectAPIResponse,
} from 'foremanReact/redux/API/APISelectors';
import { selectDoesIntervalExist } from 'foremanReact/redux/middlewares/IntervalMiddleware/IntervalSelectors';

import { TARGETING_HOSTS } from './TargetingHostsConsts';

export const selectItems = state =>
  selectAPIResponse(state, TARGETING_HOSTS).hosts || [];

export const selectAutoRefresh = state =>
  selectAPIResponse(state, TARGETING_HOSTS).autoRefresh || '';

export const selectApiStatus = state => selectAPIStatus(state, TARGETING_HOSTS);
export const selectTotalHosts = state =>
  selectAPIResponse(state, TARGETING_HOSTS).total_hosts || 0;

export const selectIntervalExists = state =>
  selectDoesIntervalExist(state, TARGETING_HOSTS);
