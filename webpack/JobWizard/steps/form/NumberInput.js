import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextInput, ValidatedOptions } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { isPositiveNumber } from './FormHelpers';

export const NumberInput = ({ formProps, inputProps }) => {
  const [validated, setValidated] = useState();
  const name = inputProps.id.replace(/-/g, ' ');
  return (
    <FormGroup
      {...formProps}
      helperTextInvalid={__('Has to be a positive number')}
      validated={validated}
    >
      <TextInput
        ouiaId={name}
        aria-label={name}
        type="text"
        {...inputProps}
        onChange={newValue => {
          setValidated(
            isPositiveNumber(newValue) || newValue === ''
              ? ValidatedOptions.noval
              : ValidatedOptions.error
          );
          inputProps.onChange(newValue);
        }}
      />
    </FormGroup>
  );
};

NumberInput.propTypes = {
  formProps: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired,
};
