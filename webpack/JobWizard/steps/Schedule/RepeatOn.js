import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Grid, GridItem, FormGroup } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { SelectField } from '../form/SelectField';
import { repeatTypes } from '../../JobWizardConstants';
import { RepeatCron } from './RepeatCron';
import { RepeatHour } from './RepeatHour';
import { RepeatMonth } from './RepeatMonth';
import { RepeatDaily } from './RepeatDaily';
import { RepeatWeek } from './RepeatWeek';

export const RepeatOn = ({
  repeatType,
  setRepeatType,
  repeatAmount,
  setRepeatAmount,
  repeatData,
  setRepeatData,
  setValid,
}) => {
  const [repeatValidated, setRepeatValidated] = useState('default');
  const handleRepeatInputChange = newValue => {
    setRepeatValidated(newValue >= 1 ? 'default' : 'error');
    setRepeatAmount(newValue);
  };

  const getRepeatComponent = () => {
    switch (repeatType) {
      case repeatTypes.cronline:
        return (
          <RepeatCron
            repeatData={repeatData}
            setRepeatData={setRepeatData}
            setValid={setValid}
          />
        );
      case repeatTypes.monthly:
        return (
          <RepeatMonth
            repeatData={repeatData}
            setRepeatData={setRepeatData}
            setValid={setValid}
          />
        );
      case repeatTypes.weekly:
        return (
          <RepeatWeek
            repeatData={repeatData}
            setRepeatData={setRepeatData}
            setValid={setValid}
          />
        );
      case repeatTypes.daily:
        return (
          <RepeatDaily
            repeatData={repeatData}
            setRepeatData={setRepeatData}
            setValid={setValid}
          />
        );
      case repeatTypes.hourly:
        return (
          <RepeatHour
            repeatData={repeatData}
            setRepeatData={setRepeatData}
            setValid={setValid}
          />
        );
      case repeatTypes.noRepeat:
      default:
        return null;
    }
  };
  return (
    <FormGroup label={__('Repeat On')}>
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
            helperTextInvalid={__(
              'Repeat amount can only be a positive number'
            )}
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
        {getRepeatComponent()}
      </Grid>
    </FormGroup>
  );
};

RepeatOn.propTypes = {
  repeatType: PropTypes.oneOf(Object.values(repeatTypes)).isRequired,
  setRepeatType: PropTypes.func.isRequired,
  repeatAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setRepeatAmount: PropTypes.func.isRequired,
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
