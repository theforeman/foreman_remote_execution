import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { stopInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import TargetingHosts from './TargetingHosts';

import {
  selectItems,
  selectStatus,
  selectAutoRefresh,
} from './TargetingHostsSelectors';
import { getData } from './TargetingHostsActions';
import { TARGETING_HOSTS } from './TargetingHostsConsts';

const WrappedTargetingHosts = () => {
  const dispatch = useDispatch();
  const autoRefresh = useSelector(selectAutoRefresh);
  const items = useSelector(selectItems);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(getData());

    return () => {
      dispatch(stopInterval(TARGETING_HOSTS));
    };
  }, [dispatch]);

  useEffect(() => {
    if (autoRefresh === 'false') {
      dispatch(stopInterval(TARGETING_HOSTS));
    }
  }, [autoRefresh, dispatch]);

  return <TargetingHosts status={status} items={items} />;
};

export default WrappedTargetingHosts;
