import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Checkbox } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { DateTimePicker } from '../form/DateTimePicker';

export const StartEndDates = ({
  starts,
  setStarts,
  ends,
  setEnds,
  isNeverEnds,
  setIsNeverEnds,
}) => {
  const toggleIsNeverEnds = (checked, event) => {
    const value = event?.target?.checked;
    setIsNeverEnds(value);
  };
  const validateEndDate = () => {
    if (isNeverEnds) return 'success';
    if (!starts || !ends) return 'success';
    if (new Date(starts).getTime() <= new Date(ends).getTime())
      return 'success';
    return 'error';
  };
  return (
    <>
      <FormGroup
        className="start-date"
        label={__('Starts')}
        fieldId="start-date"
      >
        <DateTimePicker dateTime={starts} setDateTime={setStarts} />
      </FormGroup>
      <FormGroup
        className="end-date"
        label={__('Ends')}
        fieldId="end-date"
        helperTextInvalid={__('End time needs to be after start time')}
        validated={validateEndDate()}
      >
        <DateTimePicker
          dateTime={ends}
          setDateTime={setEnds}
          isDisabled={isNeverEnds}
        />
        <Checkbox
          label={__('Never ends')}
          isChecked={isNeverEnds}
          onChange={toggleIsNeverEnds}
          id="never-ends"
          name="never-ends"
        />
      </FormGroup>
    </>
  );
};

StartEndDates.propTypes = {
  starts: PropTypes.string.isRequired,
  setStarts: PropTypes.func.isRequired,
  ends: PropTypes.string.isRequired,
  setEnds: PropTypes.func.isRequired,
  isNeverEnds: PropTypes.bool.isRequired,
  setIsNeverEnds: PropTypes.func.isRequired,
};
