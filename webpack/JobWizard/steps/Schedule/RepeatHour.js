import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';
import { range } from 'lodash';
import { translate as __ } from 'foremanReact/common/I18n';

export const RepeatHour = ({ repeatData, setRepeatData }) => {
  const [minuteOpen, setMinuteOpen] = useState(false);
  return (
    <FormGroup label={__('At minute')}>
      <Select
        id="repeat-on-hourly"
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="repeat-at-minute-typeahead"
        onSelect={(event, selection) => {
          setRepeatData({ minute: selection });
          setMinuteOpen(false);
        }}
        selections={repeatData.minute || ''}
        onToggle={toggle => {
          setMinuteOpen(toggle);
        }}
        isOpen={minuteOpen}
        width={85}
        menuAppendTo={() => document.querySelector('.pf-c-form.schedule-tab')}
      >
        {range(60).map(minute => (
          <SelectOption key={minute} value={`${minute}`} />
        ))}
      </Select>
    </FormGroup>
  );
};
RepeatHour.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
};
