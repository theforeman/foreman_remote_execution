import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const HostStatus = (props) => {
  const { status } = props;

  switch (status) {
    case 'cancelled':
      return (<Fragment><span className="pficon pficon-warning-triangle-o"></span> cancelled</Fragment>);
    case 'N/A':
      return (<Fragment><span className="fa fa-question"></span> N/A</Fragment>);
    case 'running':
      return (<Fragment><span className="pficon pficon-running"></span> running</Fragment>);
    case 'planned':
      return (<Fragment><span className="pficon pficon-build"></span> running</Fragment>);
    case 'warning':
      return (<Fragment><span className="pficon pficon-error-circle-o"></span> failed</Fragment>);
    case 'error':
      return (<Fragment><span className="pficon pficon-error-circle-o"></span> failed</Fragment>);
    case 'success':
      return (<Fragment><span className="pficon pficon-ok"></span> success</Fragment>);
    default:
      return (<span>{status}</span>);
  }
};

HostStatus.propTypes = {
  status: PropTypes.string,
};

export default HostStatus;
