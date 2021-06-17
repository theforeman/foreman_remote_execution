import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Grid, GridItem, FormGroup } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { SelectField } from '../form/SelectField';
import { repeatTypes } from '../../JobWizardConstants';

export const RepeatOn = ({
  repeatType,
  setRepeatType,
  repeatAmount,
  setRepeatAmount,
}) => {
  const [repeatValidated, setRepeatValidated] = useState('default');
  const handleRepeatInputChange = newValue => {
    setRepeatValidated(newValue >= 1 ? 'default' : 'error');
    setRepeatAmount(newValue);
  };
  return (
    <Grid>
      <GridItem span={6}>
        <SelectField
          fieldId="repeat-select"
          options={Object.values(repeatTypes)}
          setValue={newValue => {
            setRepeatType(newValue);
            if (newValue === repeatTypes.noRepeat) {
              setRepeatValidated('default');
            }
          }}
          value={repeatType}
        />
      </GridItem>
      <GridItem span={1} />
      <GridItem span={5}>
        <FormGroup
          isInline
          helperTextInvalid={__('Repeat amount can only be a positive number')}
          validated={repeatValidated}
        >
          <TextInput
            isDisabled={repeatType === repeatTypes.noRepeat}
            id="repeat-amount"
            value={repeatAmount}
            type="text"
            onChange={newValue => handleRepeatInputChange(newValue)}
            placeholder={__('Repeat N times')}
          />
        </FormGroup>
      </GridItem>
    </Grid>
  );
};

RepeatOn.propTypes = {
  repeatType: PropTypes.oneOf(Object.values(repeatTypes)).isRequired,
  setRepeatType: PropTypes.func.isRequired,
  repeatAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setRepeatAmount: PropTypes.func.isRequired,
};
