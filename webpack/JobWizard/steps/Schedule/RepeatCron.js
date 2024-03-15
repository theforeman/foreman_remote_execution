import URI from 'urijs';
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
import { foremanUrl } from 'foremanReact/common/helpers';
import { useForemanVersion } from 'foremanReact/Root/Context/ForemanContext';
import { translate as __ } from 'foremanReact/common/I18n';
import { helpLabel } from '../form/FormHelpers';

const docUrl = foremanVersion => {
  const rootUrl = `https://docs.theforeman.org/${foremanVersion}/`;
  const section =
    'Managing_Hosts/index-foreman-el.html#using-extended-cron-lines_managing-hosts';

  const url = new URI({
    path: '/links/manual',
    query: { root_url: rootUrl, section },
  });
  return foremanUrl(url.href());
};

export const RepeatCron = ({ repeatData, setRepeatData, setValid }) => {
  const foremanVersion = useForemanVersion();
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
      label={__('Cron line (extended)')}
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
          <br />
          {__(
            'The cron line supports extended cron line syntax. For details please refer to the '
          )}
          <a href={docUrl(foremanVersion)} target="_blank" rel="noreferrer">
            {__('documentation')}
          </a>
          .
        </div>
      )}
      isRequired
    >
      <TextInput
        ouiaId="cronline"
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
