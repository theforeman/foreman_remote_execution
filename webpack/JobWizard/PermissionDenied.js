import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Icon } from 'patternfly-react';
import {
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
} from '@patternfly/react-core';

const PermissionDenied = ({ missingPermissions, setProceedAnyway }) => {
  const description = (
    <span>
      {__('You are not authorized to perform this action.')}
      <br />
      {__(
        'Please request the required permissions listed below from a Foreman administrator:'
      )}
      <br />
      <ul className="list-unstyled">
        {missingPermissions.map(permission => (
          <li key={permission}>
            <strong>{permission}</strong>
          </li>
        ))}
      </ul>
    </span>
  );
  const handleProceedAnyway = () => {
    setProceedAnyway(true);
  };

  return (
    <EmptyState variant={EmptyStateVariant.xl}>
      <span className="empty-state-icon">
        <Icon name="lock" type="fa" size="2x" />
      </span>
      <Title ouiaId="empty-state-header" headingLevel="h5" size="4xl">
        {__('Permission Denied')}
      </Title>
      <EmptyStateBody>{description}</EmptyStateBody>
      <Button
        ouiaId="job-invocation-proceed-anyway-button"
        variant="primary"
        onClick={handleProceedAnyway}
      >
        {__('Proceed Anyway')}
      </Button>
    </EmptyState>
  );
};

PermissionDenied.propTypes = {
  missingPermissions: PropTypes.array,
  setProceedAnyway: PropTypes.func.isRequired,
};

PermissionDenied.defaultProps = {
  missingPermissions: ['unknown'],
};

export default PermissionDenied;
