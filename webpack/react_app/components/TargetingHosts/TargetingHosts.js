import React, { useState, useEffect } from 'react';
import API from 'foremanReact/API';
import PropTypes from 'prop-types';
import HostItem from './HostItem/HostItem.js';

const TargetingHosts = (props) => {
  const { jobInvocationId } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hosts, setHosts] = useState([]);

  const renderLoading = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="3" className="text-center">
            Loading hosts ...
          </td>
        </tr>
      );
    }

    return (null);
  };

  const getHostsData = () => {
    const apiUrl = `/job_invocations/${jobInvocationId}?format=json`;

    API.get(apiUrl)
      .then((result) => {
        setHosts(result.data.hosts);
        setLoading(false);

        if (result.data.autoRefresh === 'true') {

          setTimeout(() => {
            getHostsData();
          }, 1000);
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  const renderError = () => {
    if (error) {
      return (
        <tr>
          <td colSpan="3" className="text-center">
            <div className="alert alert-danger">
              <span className="pficon pficon-error-circle-o "></span>
                <span className="text">There was an error while updating the status, try refreshing the page.</span>
            </div>
          </td>
        </tr>
      );
    }
    return (null);
  };

  useEffect(() => {
    getHostsData();
  }, [null]);

  return (
    <div>
      <table className="table table-bordered table-striped table-hover ">
        <thead>
          <tr>
            <th>Host</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { renderLoading() }
          { renderError() }

          { hosts.map(host => <HostItem host={host} key={host.name}/>)}
        </tbody>
      </table>
    </div>
  );
};

TargetingHosts.propTypes = {
  jobInvocationId: PropTypes.number.isRequired,
};

export default TargetingHosts;
