import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, FormGroup } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { helpLabel } from '../form/FormHelpers';

export const RepeatCron = ({ repeatData, setRepeatData }) => (
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
  >
    <TextInput
      aria-label="cronline"
      placeholder="* * * * *"
      type="text"
      value={repeatData.cronline || ''}
      onChange={newTime => {
        setRepeatData({ cronline: newTime });
      }}
    />
  </FormGroup>
);
RepeatCron.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
};
