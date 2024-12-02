import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  ValidatedOptions,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { isPositiveNumber } from './FormHelpers';

export const NumberInput = ({ formProps, inputProps }) => {
  const [validated, setValidated] = useState();
  const name = inputProps.id.replace(/-/g, ' ');
  return (
    <FormGroup {...formProps}>
      <TextInput
        ouiaId={name}
        aria-label={name}
        type="text"
        {...inputProps}
        onChange={(_event, newValue) => {
          setValidated(
            isPositiveNumber(newValue) || newValue === ''
              ? ValidatedOptions.noval
              : ValidatedOptions.error
          );
          inputProps.onChange(newValue);
        }}
      />
      {validated === 'error' && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{__('Has to be a positive number')}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
};

NumberInput.propTypes = {
  formProps: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired,
};
