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
  selectStatusFilter,
} from './TargetingHostsSelectors';
import { getApiUrl } from './TargetingHostsHelpers';
import { TARGETING_HOSTS } from './TargetingHostsConsts';
import TargetingHostsPage from './TargetingHostsPage';
import { chartFilter } from '../../redux/actions/jobInvocations';

const buildSearchQuery = (query, stateFilter) => {
  const filters = Object.entries(stateFilter).map(
    ([key, value]) => `${key} = ${value}`
  );
  return [query, filters]
    .flat()
    .filter(x => x)
    .map(x => `(${x})`)
    .join(' AND ');
};

const WrappedTargetingHosts = () => {
  const dispatch = useDispatch();
  const { perPage, perPageOptions } = useForemanSettings();

  const autoRefresh = useSelector(selectAutoRefresh);
  const items = useSelector(selectItems);
  const apiStatus = useSelector(selectApiStatus);
  const totalHosts = useSelector(selectTotalHosts);
  const statusFilter = useSelector(selectStatusFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: perPage,
    perPageOptions,
  });
  const [apiUrl, setApiUrl] = useState(getApiUrl(searchQuery, pagination));
  const intervalExists = useSelector(selectIntervalExists);

  const handleSearch = (query, status) => {
    const defaultPagination = { page: 1, per_page: pagination.per_page };
    stopApiInterval();

    setApiUrl(getApiUrl(buildSearchQuery(query, status), defaultPagination));
    setSearchQuery(query);
    setPagination(defaultPagination);
  };

  const handlePagination = args => {
    stopApiInterval();
    setPagination(args);
    setApiUrl(getApiUrl(buildSearchQuery(searchQuery, statusFilter), args));
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

  useEffect(() => {
    handleSearch(searchQuery, statusFilter);
  }, [statusFilter, searchQuery]);

  return (
    <TargetingHostsPage
      handleSearch={handleSearch}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      statusFilterReset={_x => chartFilter(null)(dispatch, null)}
      apiStatus={apiStatus}
      items={items}
      totalHosts={totalHosts}
      handlePagination={handlePagination}
      page={pagination.page}
    />
  );
};

export default WrappedTargetingHosts;
