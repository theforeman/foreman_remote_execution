import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TimePicker } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const RepeatDaily = ({ repeatData, setRepeatData, setValid }) => {
  const { at } = repeatData;
  useEffect(() => {
    if (at) {
      setValid(true);
    } else {
      setValid(false);
    }
    return () => setValid(true);
  }, [setValid, at]);
  return (
    <FormGroup label={__('At')} isRequired>
      <TimePicker
        aria-label="repeat-at"
        className="time-picker"
        time={repeatData.at}
        placeholder="hh:mm"
        onChange={(e, newTime) => {
          setRepeatData({ ...repeatData, at: newTime });
        }}
        is24Hour
        invalidFormatErrorMessage={__('Invalid time format')}
      />
    </FormGroup>
  );
};

RepeatDaily.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
