import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import { JOB_SUCCESS_STATUS, JOB_ERROR_STATUS } from './constants';
import './styles.scss';

const JobStatusIcon = ({ status, children, ...props }) => {
  switch (status) {
    case JOB_SUCCESS_STATUS:
      return (
        <span className="job-success">
          <CheckCircleIcon {...props} /> {children}
        </span>
      );
    case JOB_ERROR_STATUS:
      return (
        <span className="job-error">
          <ExclamationCircleIcon {...props} /> {children}
        </span>
      );
    default:
      return (
        <span className="job-info">
          <QuestionCircleIcon {...props} /> {children}
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
