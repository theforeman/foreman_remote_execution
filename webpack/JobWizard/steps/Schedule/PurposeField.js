import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, FormGroup } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { helpLabel } from '../form/FormHelpers';

export const PurposeField = ({ isDisabled, purpose, setPurpose }) => (
  <FormGroup
    label={__('Purpose')}
    labelIcon={helpLabel(
      __(
        'A special label for tracking a recurring job. There can be only one active job with a given purpose at a time.'
      )
    )}
  >
    <TextInput
      isDisabled={isDisabled}
      aria-label="purpose"
      type="text"
      value={purpose}
      onChange={newPurpose => {
        setPurpose(newPurpose);
      }}
    />
  </FormGroup>
);
PurposeField.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  purpose: PropTypes.string.isRequired,
  setPurpose: PropTypes.func.isRequired,
};
