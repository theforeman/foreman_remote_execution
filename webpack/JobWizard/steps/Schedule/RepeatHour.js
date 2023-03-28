import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Alert,
  AlertActionCloseButton,
  ValidatedOptions,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { helpLabel } from '../form/FormHelpers';

export const RepeatHour = ({ repeatData, setRepeatData }) => {
  const isValidMinute = newMinute =>
    Number.isInteger(parseInt(newMinute, 10)) &&
    newMinute >= 0 &&
    newMinute < 60;

  const { minute } = repeatData;
  useEffect(() => {
    if (!isValidMinute(minute)) {
      setRepeatData({ minute: 0 });
    }
  }, [minute, setRepeatData]);
  const [minuteOpen, setMinuteOpen] = useState(false);
  const [options, setOptions] = useState([0, 15, 30, 45]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  return (
    <FormGroup
      label={__('At minute')}
      labelIcon={helpLabel(<div>{__('range: 0-59')}</div>)}
      isRequired
    >
      <Select
        id="repeat-on-hourly"
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="repeat-at-minute-typeahead"
        onSelect={(event, selection) => {
          setRepeatData({ minute: parseInt(selection, 10) });
          setMinuteOpen(false);
        }}
        selections={`${minute}` || ''}
        onToggle={toggle => {
          setMinuteOpen(toggle);
        }}
        isOpen={minuteOpen}
        width={125}
        toggleAriaLabel="select minute toggle"
        validated={
          isValidMinute(minute)
            ? ValidatedOptions.noval
            : ValidatedOptions.error
        }
        onCreateOption={newValue => {
          if (isValidMinute(newValue)) {
            setOptions(prev => [...prev, parseInt(newValue, 10)].sort());
            setRepeatData({ minute: parseInt(newValue, 10) });
            setIsAlertOpen(false);
          } else {
            setIsAlertOpen(true);
          }
        }}
        isCreatable
        createText={__('Create')}
      >
        {options.map(minuteNumber => (
          <SelectOption
            key={minuteNumber}
            value={`${minuteNumber}`}
            onClick={() => setIsAlertOpen(false)}
          />
        ))}
      </Select>
      {isAlertOpen && (
        <Alert
          variant="danger"
          isInline
          title={__('Minute can only be a number between 0-59')}
          actionClose={
            <AlertActionCloseButton onClose={() => setIsAlertOpen(false)} />
          }
        />
      )}
    </FormGroup>
  );
};
RepeatHour.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
};
