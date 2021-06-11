import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextInput, ValidatedOptions } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const NumberInput = ({ formProps, inputProps }) => {
  const { value } = inputProps;
  const [validated, setValidated] = useState();
  useEffect(() => {
    setValidated(
      /^\d+$/.test(value) || value === ''
        ? ValidatedOptions.noval
        : ValidatedOptions.error
    );
  }, [value]);

  return (
    <FormGroup
      {...formProps}
      helperTextInvalid={__('Has to be a number')}
      validated={validated}
    >
      <TextInput type="number" {...inputProps} />
    </FormGroup>
  );
};

NumberInput.propTypes = {
  formProps: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired,
};
