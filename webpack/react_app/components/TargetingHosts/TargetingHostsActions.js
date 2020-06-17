import { getURI } from 'foremanReact/common/urlHelpers';
import { get } from 'foremanReact/redux/API';
import { withInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { TARGETING_HOSTS } from './TargetingHostsConsts';

const url = getURI().addQuery('format', 'json');
export const getData = () =>
  withInterval(get({ key: TARGETING_HOSTS, url }), 1000);
