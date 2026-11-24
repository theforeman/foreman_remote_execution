import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Alert,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { MINUTES_PER_HOUR } from 'foremanReact/constants';
import { helpLabel } from '../form/FormHelpers';
import { TypeaheadSelect } from '../form/TypeaheadSelect';
import { DEFAULT_MINUTE_OPTIONS } from '../../JobWizardConstants';

export const RepeatHour = ({ repeatData, setRepeatData }) => {
  const isValidMinute = newMinute =>
    Number.isInteger(parseInt(newMinute, 10)) &&
    newMinute >= 0 &&
    newMinute < MINUTES_PER_HOUR;

  const { minute } = repeatData;
  useEffect(() => {
    if (!isValidMinute(minute)) {
      setRepeatData({ minute: 0 });
    }
  }, [minute, setRepeatData]);
  const [options, setOptions] = useState(DEFAULT_MINUTE_OPTIONS);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  return (
    <FormGroup
      label={__('At minute')}
      labelHelp={helpLabel(<div>{__('range: 0-59')}</div>)}
      isRequired
    >
      <TypeaheadSelect
        ouiaId="repeat-on-hourly"
        id="repeat-on-hourly"
        typeAheadAriaLabel="repeat-at-minute-typeahead"
        toggleAriaLabel="select minute toggle"
        width={125}
        maxMenuHeight="300px"
        isCreatable
        createText={__('Create')}
        selected={`${minute}`}
        validated={isValidMinute(minute) ? 'default' : 'error'}
        options={options.map(minuteNumber => ({
          value: `${minuteNumber}`,
          label: `${minuteNumber}`,
        }))}
        onSelect={selection => {
          setRepeatData({ minute: parseInt(selection, 10) });
          setIsAlertOpen(false);
        }}
        onCreateOption={newValue => {
          if (isValidMinute(newValue)) {
            setOptions(prev => [...prev, parseInt(newValue, 10)].sort());
            setRepeatData({ minute: parseInt(newValue, 10) });
            setIsAlertOpen(false);
          } else {
            setIsAlertOpen(true);
          }
        }}
      />
      {isAlertOpen && (
        <Alert
          ouiaId="repeat-on-hourly-alert"
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
