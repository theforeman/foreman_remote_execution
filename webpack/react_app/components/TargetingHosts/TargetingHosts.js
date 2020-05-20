import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingState } from 'patternfly-react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import HostItem from './HostItem/HostItem';
import { getTargetingHostsAction } from '../../redux/actions/TargetingHosts';
import {
  selectLoadingState,
  selectErrorState,
  selectHostsState,
  selectRefreshState,
} from '../../redux/selectors/TargetingHosts';

const TargetingHosts = ({ data }) => {
  const { jobInvocationId } = data;
  const loading = useSelector(state => selectLoadingState(state));
  const error = useSelector(state => selectErrorState(state));
  const hosts = useSelector(state => selectHostsState(state));
  const refresh = useSelector(state => selectRefreshState(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (refresh === true) {
      setTimeout(
        () =>
          dispatch(
            getTargetingHostsAction(
              `/job_invocations/${jobInvocationId}?format=json`
            )
          ),
        loading ? 0 : 1000
      );
    }
  }, [dispatch, hosts, jobInvocationId, refresh, loading]);

  if (error) {
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
    <LoadingState loading={loading}>
      <table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>{__('Host')}</th>
            <th>{__('Status')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map(host => (
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
    </LoadingState>
  );
};

TargetingHosts.propTypes = {
  data: PropTypes.shape({
    jobInvocationId: PropTypes.number.isRequired,
  }).isRequired,
};

export default TargetingHosts;
