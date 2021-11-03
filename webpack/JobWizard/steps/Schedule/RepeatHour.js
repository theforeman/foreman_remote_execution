import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';
import { range } from 'lodash';
import { translate as __ } from 'foremanReact/common/I18n';

export const RepeatHour = ({ repeatData, setRepeatData, setValid }) => {
  const { minute } = repeatData;
  useEffect(() => {
    if (minute) {
      setValid(true);
    } else {
      setValid(false);
    }
    return () => setValid(true);
  }, [setValid, minute]);
  const [minuteOpen, setMinuteOpen] = useState(false);
  return (
    <FormGroup label={__('At minute')} isRequired>
      <Select
        id="repeat-on-hourly"
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="repeat-at-minute-typeahead"
        onSelect={(event, selection) => {
          setRepeatData({ minute: selection });
          setMinuteOpen(false);
        }}
        selections={minute || ''}
        onToggle={toggle => {
          setMinuteOpen(toggle);
        }}
        isOpen={minuteOpen}
        width={85}
        menuAppendTo={() => document.querySelector('.pf-c-form.schedule-tab')}
        toggleAriaLabel="select minute toggle"
        validated={minute ? 'success' : 'error'}
      >
        {range(60).map(minuteNumber => (
          <SelectOption key={minuteNumber} value={`${minuteNumber}`} />
        ))}
      </Select>
    </FormGroup>
  );
};
RepeatHour.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
