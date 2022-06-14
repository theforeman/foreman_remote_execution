import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from '@patternfly/react-core';
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
  repeatData,
  setRepeatData,
  setValid,
}) => {
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
          <RepeatHour repeatData={repeatData} setRepeatData={setRepeatData} />
        );
      default:
        return null;
    }
  };
  return (
    <>
      <FormGroup label={__('Repeats')}>
        <SelectField
          isRequired
          fieldId="repeat-select"
          options={Object.values(repeatTypes).filter(
            type => type !== repeatTypes.noRepeat
          )}
          setValue={newValue => {
            setRepeatType(newValue);
          }}
          value={repeatType}
        />
      </FormGroup>
      {getRepeatComponent()}
    </>
  );
};

RepeatOn.propTypes = {
  repeatType: PropTypes.oneOf(Object.values(repeatTypes)).isRequired,
  setRepeatType: PropTypes.func.isRequired,
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
