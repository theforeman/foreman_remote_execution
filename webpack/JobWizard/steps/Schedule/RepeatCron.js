import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListComponent,
  OrderType,
  TextInput,
  FormGroup,
  ValidatedOptions,
} from '@patternfly/react-core';
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
          {__("Cron line format '1 2 3 4 5', where:")}
          <br />
          <List component={ListComponent.ol} type={OrderType.number}>
            <ListItem>{__('is minute (range: 0-59)')}</ListItem>
            <ListItem>{__('is hour (range: 0-23)')}</ListItem>
            <ListItem>{__('is day of month (range: 1-31)')}</ListItem>
            <ListItem>{__('is month (range: 1-12)')}</ListItem>
            <ListItem>{__('is day of week (range: 0-6)')}</ListItem>
          </List>
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
