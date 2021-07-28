import React, { useState, useEffect } from 'react';
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
  setValid,
}) => {
  const [validEnd, setValidEnd] = useState(true);
  const toggleIsNeverEnds = (checked, event) => {
    const value = event?.target?.checked;
    setIsNeverEnds(value);
  };
  useEffect(() => {
    if (isNeverEnds) setValidEnd(true);
    else if (!starts || !ends) setValidEnd(true);
    else if (new Date(starts).getTime() <= new Date(ends).getTime())
      setValidEnd(true);
    else setValidEnd(false);
  }, [starts, ends, isNeverEnds]);
  useEffect(() => {
    setValid(validEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validEnd]);
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
        validated={validEnd ? 'success' : 'error'}
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
  setValid: PropTypes.func.isRequired,
};
