import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput, FormGroup, ValidatedOptions } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { helpLabel } from '../form/FormHelpers';

export const RepeatCron = ({ repeatData, setRepeatData, setValid }) => {
  const { cronline } = repeatData;
  useEffect(() => {
    if (cronline) {
      setValid(true);
    } else {
      setValid(false);
    }
    return () => setValid(true);
  }, [setValid, cronline]);
  return (
    <FormGroup
      label={__('Cron line')}
      labelIcon={helpLabel(
        <div>
          {__("Cron line format 'a b c d e', where:")}
          <br />
          <ol>
            <li>{__('is minute (range: 0-59)')}</li>
            <li>{__('is hour (range: 0-23)')}</li>
            <li>{__('is day of month (range: 1-31)')}</li>
            <li>{__('is month (range: 1-12)')}</li>
            <li>{__('is day of week (range: 0-6)')}</li>
          </ol>
        </div>
      )}
      isRequired
    >
      <TextInput
        isRequired
        validated={cronline ? ValidatedOptions.noval : ValidatedOptions.error}
        aria-label="cronline"
        placeholder="* * * * *"
        type="text"
        value={cronline || ''}
        onChange={newTime => {
          setRepeatData({ cronline: newTime });
        }}
      />
    </FormGroup>
  );
};
RepeatCron.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
