import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  BuildIcon,
  RunningIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import {
  JOB_SUCCESS_STATUS,
  JOB_ERROR_STATUS,
  JOB_PLANNED_STATUS,
  JOB_RUNNING_STATUS,
  JOB_CANCELLED_STATUS,
  JOB_AWAITING_STATUS,
} from './constants';
import './styles.scss';

const JobStatusIcon = ({ status, children, ...props }) => {
  switch (status) {
    case JOB_SUCCESS_STATUS:
      return (
        <span>
          <CheckCircleIcon className="job-success" {...props} /> {children}
        </span>
      );
    case JOB_ERROR_STATUS:
      return (
        <span>
          <ExclamationCircleIcon className="job-error" {...props} /> {children}
        </span>
      );
    case JOB_PLANNED_STATUS:
      return (
        <span>
          <BuildIcon className="job-planned" {...props} /> {children}
        </span>
      );
    case JOB_RUNNING_STATUS:
      return (
        <span>
          <RunningIcon className="job-running" {...props} /> {children}
        </span>
      );
    case JOB_CANCELLED_STATUS:
      return (
        <span>
          <ExclamationTriangleIcon className="job-cancelled" {...props} />{' '}
          {children}
        </span>
      );
    case JOB_AWAITING_STATUS:
      return <span className="job-awaiting_start">{children}</span>;
    default:
      return (
        <span>
          <QuestionCircleIcon className="job-unknown" {...props} /> {children}
        </span>
      );
  }
};

JobStatusIcon.propTypes = {
  status: PropTypes.number,
  children: PropTypes.string.isRequired,
};

JobStatusIcon.defaultProps = {
  status: undefined,
};

export default JobStatusIcon;
