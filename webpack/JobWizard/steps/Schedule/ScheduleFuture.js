import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Form,
  Button,
  ValidatedOptions,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { DateTimePicker } from '../form/DateTimePicker';
import { helpLabel } from '../form/FormHelpers';
import { SCHEDULE_TYPES } from '../../JobWizardConstants';
import { WizardTitle } from '../form/WizardTitle';

export const ScheduleFuture = ({
  scheduleValue: { startsAt, startsBefore },
  setScheduleValue,
  setValid,
}) => {
  const [error, setError] = useState(null);

  const wrappedSetValid = useCallback(setValid, []);
  useEffect(() => {
    if (!startsBefore?.length && !startsAt?.length) {
      wrappedSetValid(false);
      setError(
        __(
          "For Future execution a 'Starts at' date or 'Starts before' date must be selected. Immediate execution can be selected in the previous step."
        )
      );
    } else if (!startsBefore?.length) {
      wrappedSetValid(true);
      setError(null);
    } else if (
      new Date(startsAt).getTime() >= new Date(startsBefore).getTime()
    ) {
      wrappedSetValid(false);
      setError(__("'Starts before' date must be after 'Starts at' date"));
    } else if (new Date().getTime() >= new Date(startsBefore).getTime()) {
      wrappedSetValid(false);
      setError(__("'Starts before' date must in the future"));
    } else {
      wrappedSetValid(true);
      setError(null);
    }
  }, [wrappedSetValid, startsAt, startsBefore]);

  return (
    <>
      <WizardTitle title={SCHEDULE_TYPES.FUTURE} />
      <Form className="future-schedule-tab">
        <FormGroup label={__('Starts at')} fieldId="start-at-date">
          <DateTimePicker
            ariaLabel="starts at"
            dateTime={startsAt}
            setDateTime={newValue =>
              setScheduleValue(current => ({
                ...current,
                startsAt: newValue,
              }))
            }
          />
          <Button
            variant="link"
            isInline
            className="clear-datetime-button"
            onClick={() =>
              setScheduleValue(current => ({
                ...current,
                startsAt: null,
              }))
            }
          >
            {__('Clear input')}
          </Button>
        </FormGroup>

        <FormGroup
          label={__('Starts before')}
          fieldId="start-before-date"
          labelIcon={helpLabel(
            __(
              'Indicates that the action should be cancelled if it cannot be started before this time.'
            ),
            'start-before-date'
          )}
          validated={error ? ValidatedOptions.error : ValidatedOptions.noval}
          helperTextInvalid={error}
        >
          <DateTimePicker
            ariaLabel="starts before"
            dateTime={startsBefore}
            setDateTime={newValue =>
              setScheduleValue(current => ({
                ...current,
                startsBefore: newValue,
              }))
            }
          />
          <Button
            variant="link"
            isInline
            className="clear-datetime-button"
            onClick={() =>
              setScheduleValue(current => ({
                ...current,
                startsBefore: null,
              }))
            }
          >
            {__('Clear input')}
          </Button>
        </FormGroup>
      </Form>
    </>
  );
};

ScheduleFuture.propTypes = {
  scheduleValue: PropTypes.shape({
    startsAt: PropTypes.string,
    startsBefore: PropTypes.string,
  }).isRequired,
  setScheduleValue: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
