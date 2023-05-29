import React from 'react';
import { FormGroup, TextArea } from '@patternfly/react-core';
import PropTypes from 'prop-types';

export const OutputTemplateTextField = ({
  runtimeTemplate,
  setRuntimeTemplate,
}) => (
  <FormGroup label="Runtime template" isRequired={false}>
    <TextArea
      required={false}
      value={runtimeTemplate}
      onChange={setRuntimeTemplate}
    />
  </FormGroup>
);

OutputTemplateTextField.propTypes = {
  runtimeTemplate: PropTypes.string.isRequired,
  setRuntimeTemplate: PropTypes.func.isRequired,
};
