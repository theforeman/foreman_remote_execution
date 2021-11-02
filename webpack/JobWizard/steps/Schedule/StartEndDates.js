import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Checkbox } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { DateTimePicker } from '../form/DateTimePicker';
import { helpLabel } from '../form/FormHelpers';

export const StartEndDates = ({
  startsAt,
  setStartsAt,
  startsBefore,
  setStartsBefore,
  ends,
  setEnds,
  isNeverEnds,
  setIsNeverEnds,
  validEnd,
  setValidEnd,
  isFuture,
  isStartBeforeDisabled,
  isEndDisabled,
}) => {
  const toggleIsNeverEnds = (checked, event) => {
    const value = event?.target?.checked;
    setIsNeverEnds(value);
  };
  useEffect(() => {
    if (isNeverEnds) setValidEnd(true);
    else if ((!startsAt.length && !startsBefore.length) || !ends)
      setValidEnd(true);
    else if (
      startsAt.length
        ? new Date(startsAt).getTime() <= new Date(ends).getTime()
        : new Date(startsBefore).getTime() <= new Date(ends).getTime()
    )
      setValidEnd(true);
    else setValidEnd(false);
  }, [startsAt, startsBefore, ends, isNeverEnds, setValidEnd]);
  return (
    <>
      <FormGroup label={__('Starts at')} fieldId="start-at-date">
        <DateTimePicker
          allowEmpty={!isFuture}
          ariaLabel="starts at"
          dateTime={startsAt}
          setDateTime={setStartsAt}
        />
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
      >
        <DateTimePicker
          isDisabled={isStartBeforeDisabled}
          allowEmpty={!isFuture}
          ariaLabel="starts before"
          dateTime={startsBefore}
          setDateTime={setStartsBefore}
        />
      </FormGroup>
      <FormGroup
        label={__('Ends')}
        fieldId="end-date"
        helperTextInvalid={__('End time needs to be after start time')}
        validated={validEnd ? 'success' : 'error'}
      >
        <DateTimePicker
          ariaLabel="ends"
          dateTime={ends}
          setDateTime={setEnds}
          isDisabled={isNeverEnds || isEndDisabled}
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
  startsAt: PropTypes.string.isRequired,
  setStartsAt: PropTypes.func.isRequired,
  startsBefore: PropTypes.string.isRequired,
  setStartsBefore: PropTypes.func.isRequired,
  ends: PropTypes.string.isRequired,
  setEnds: PropTypes.func.isRequired,
  isNeverEnds: PropTypes.bool.isRequired,
  setIsNeverEnds: PropTypes.func.isRequired,
  validEnd: PropTypes.bool.isRequired,
  setValidEnd: PropTypes.func.isRequired,
  isFuture: PropTypes.bool.isRequired,
  isStartBeforeDisabled: PropTypes.bool.isRequired,
  isEndDisabled: PropTypes.bool.isRequired,
};
