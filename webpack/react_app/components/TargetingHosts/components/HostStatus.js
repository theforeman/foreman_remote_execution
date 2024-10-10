import React from 'react';
import { Icon } from 'patternfly-react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

const HostStatus = ({ status }) => {
  switch (status) {
    case 'cancelled':
      return (
        <div>
          <Icon type="pf" name="warning-triangle-o" /> {__('Cancelled')}
        </div>
      );
    case 'N/A':
      return (
        <div>
          <Icon type="fa" name="question" /> {__('Awaiting start')}
        </div>
      );
    case 'running':
      return (
        <div>
          <Icon type="pf" name="running" /> {__('Pending')}
        </div>
      );
    case 'planned':
      return (
        <div>
          <Icon type="pf" name="build" /> {__('Scheduled')}
        </div>
      );
    case 'warning':
    case 'error':
      return (
        <div>
          <Icon type="pf" name="error-circle-o" /> {__('Failed')}
        </div>
      );
    case 'success':
      return (
        <div>
          <Icon type="pf" name="ok" /> {__('Succeeded')}
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
