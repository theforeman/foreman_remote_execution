import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextInput, Checkbox } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

// TODO: change to datepicker
export const StartEndDates = ({ starts, setStarts, ends, setEnds }) => {
  const [isNeverEnds, setIsNeverEnds] = useState(false);
  const toggleIsNeverEnds = (checked, event) => {
    const value = event?.target?.checked;
    setIsNeverEnds(value);
    setEnds('');
  };
  return (
    <>
      <FormGroup label={__('Starts')} fieldId="start-date">
        <TextInput
          id="start-date"
          value={starts}
          type="text"
          onChange={newValue => setStarts(newValue)}
          placeholder="mm/dd/yy, hh:mm UTC"
        />
      </FormGroup>
      <FormGroup label={__('Ends')} fieldId="end-date">
        <TextInput
          isDisabled={isNeverEnds}
          id="end-date"
          value={ends}
          type="text"
          onChange={newValue => setEnds(newValue)}
          placeholder="mm/dd/yy, hh:mm UTC"
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
};
