import React from 'react';
import { Divider, Alert } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const StartsBeforeErrorAlert = () => (
  <>
    <Alert
      ouiaId="starts-before-error-alert"
      variant="danger"
      title={__("'Starts before' date must be in the future")}
    >
      {__(
        'Please go back to "Schedule" - "Future execution" step to fix the error'
      )}
    </Alert>
    <Divider component="div" />
  </>
);

export const StartsAtErrorAlert = () => (
  <>
    <Alert
      ouiaId="starts-at-error-alert"
      variant="danger"
      title={__("'Starts at' date must be in the future")}
    >
      {__(
        'Please go back to "Schedule" - "Future execution" or "Recurring execution" step to fix the error'
      )}
    </Alert>
    <Divider component="div" />
  </>
);
