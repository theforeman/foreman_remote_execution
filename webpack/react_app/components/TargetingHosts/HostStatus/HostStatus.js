import React from 'react';
import { Icon } from 'patternfly-react';
import PropTypes from 'prop-types';

const HostStatus = ({ status }) => {
  switch (status) {
    case 'cancelled':
      return (
        <div>
          <Icon type="pf" name="warning-triangle-o" /> cancelled
        </div>
      );
    case 'N/A':
      return (
        <div>
          <Icon type="fa" name="question" /> N/A
        </div>
      );
    case 'running':
      return (
        <div>
          <Icon type="pf" name="running" /> running
        </div>
      );
    case 'planned':
      return (
        <div>
          <Icon type="pf" name="build" /> planned
        </div>
      );
    case 'warning':
      return (
        <div>
          <Icon type="pf" name="error-circle-o" /> failed
        </div>
      );
    case 'error':
      return (
        <div>
          <Icon type="pf" name="error-circle-o" /> failed
        </div>
      );
    case 'success':
      return (
        <div>
          <Icon type="pf" name="ok" /> success
        </div>
      );
    default:
      return <span>{status}</span>;
  }
};

HostStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default HostStatus;
