import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import { LoadingState } from 'patternfly-react';
import { stopInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { STATUS } from 'foremanReact/constants';
import HostItem from './HostItem/HostItem';
import {
  selectItems,
  selectStatus,
  selectAutoRefresh,
} from './TargetingHostsSelectors';
import { getData } from './TargetingHostsActions';
import { TARGETING_HOSTS } from './TargetingHostsConsts';

const TargetingHosts = () => {
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

  if (status === STATUS.ERROR) {
    return (
      <div className="alert alert-danger">
        <span className="pficon pficon-error-circle-o " />
        <span className="text">
          {__(
            'There was an error while updating the status, try refreshing the page.'
          )}
        </span>
      </div>
    );
  }

  return (
    <LoadingState loading={!items.length}>
      <div>
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>{__('Host')}</th>
              <th>{__('Status')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(host => (
              <HostItem
                key={host.name}
                name={host.name}
                link={host.link}
                status={host.status}
                actions={host.actions}
              />
            ))}
          </tbody>
        </table>
      </div>
    </LoadingState>
  );
};

export default TargetingHosts;
