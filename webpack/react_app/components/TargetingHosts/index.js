import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { get } from 'foremanReact/redux/API';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import {
  withInterval,
  stopInterval,
} from 'foremanReact/redux/middlewares/IntervalMiddleware';

import {
  selectItems,
  selectApiStatus,
  selectAutoRefresh,
  selectTotalHosts,
  selectIntervalExists,
} from './TargetingHostsSelectors';
import { getApiUrl } from './TargetingHostsHelpers';
import { TARGETING_HOSTS } from './TargetingHostsConsts';
import TargetingHostsPage from './TargetingHostsPage';

const WrappedTargetingHosts = () => {
  const dispatch = useDispatch();
  const { perPage, perPageOptions } = useForemanSettings();

  const autoRefresh = useSelector(selectAutoRefresh);
  const items = useSelector(selectItems);
  const apiStatus = useSelector(selectApiStatus);
  const totalHosts = useSelector(selectTotalHosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: perPage,
    perPageOptions,
  });
  const [apiUrl, setApiUrl] = useState(getApiUrl(searchQuery, pagination));
  const intervalExists = useSelector(selectIntervalExists);

  const handleSearch = query => {
    const defaultPagination = { page: 1, per_page: pagination.per_page };
    stopApiInterval();

    setApiUrl(getApiUrl(query, defaultPagination));
    setSearchQuery(query);
    setPagination(defaultPagination);
  };

  const handlePagination = args => {
    stopApiInterval();
    setPagination(args);
    setApiUrl(getApiUrl(searchQuery, args));
  };

  const stopApiInterval = () => {
    if (intervalExists) {
      dispatch(stopInterval(TARGETING_HOSTS));
    }
  };

  const getData = url =>
    withInterval(
      get({
        key: TARGETING_HOSTS,
        url,
        handleError: () => {
          dispatch(stopInterval(TARGETING_HOSTS));
        },
      }),
      1000
    );

  useEffect(() => {
    dispatch(getData(apiUrl));

    if (autoRefresh === 'false') {
      dispatch(stopInterval(TARGETING_HOSTS));
    }

    return () => {
      dispatch(stopInterval(TARGETING_HOSTS));
    };
  }, [dispatch, apiUrl, autoRefresh]);

  return (
    <TargetingHostsPage
      handleSearch={handleSearch}
      searchQuery={searchQuery}
      apiStatus={apiStatus}
      items={items}
      totalHosts={totalHosts}
      handlePagination={handlePagination}
    />
  );
};

export default WrappedTargetingHosts;
