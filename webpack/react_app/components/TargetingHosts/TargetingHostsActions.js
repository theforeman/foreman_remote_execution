import { getURI } from 'foremanReact/common/urlHelpers';
import { API_OPERATIONS } from 'foremanReact/redux/API/APIConstants';
import {
  TARGETING_HOSTS,
} from './TargetingHostsConsts';

export const getData = () => {
  const url = getURI().addQuery('format', 'json');
  return {
    type: API_OPERATIONS.GET,
    interval: 1000,
    payload: {
      key: TARGETING_HOSTS,
      url: `${url.pathname()}${url.search()}`,
    },
  };
};
