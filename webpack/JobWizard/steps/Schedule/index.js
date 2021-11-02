import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';
import { ScheduleType } from './ScheduleType';
import { RepeatOn } from './RepeatOn';
import { QueryType } from './QueryType';
import { StartEndDates } from './StartEndDates';
import { WIZARD_TITLES, repeatTypes } from '../../JobWizardConstants';
import { PurposeField } from './PurposeField';
import { WizardTitle } from '../form/WizardTitle';

const Schedule = ({ scheduleValue, setScheduleValue, setValid }) => {
  const {
    repeatType,
    repeatAmount,
    repeatData,
    startsAt,
    startsBefore,
    ends,
    isNeverEnds,
    isFuture,
    isTypeStatic,
    purpose,
  } = scheduleValue;

  const [validEnd, setValidEnd] = useState(true);
  useEffect(() => {
    if (!validEnd) {
      setValid(false);
    } else if (isFuture && (startsAt.length || startsBefore.length)) {
      setValid(true);
    } else if (!isFuture) {
      setValid(true);
    } else {
      setValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startsAt, startsBefore, isFuture, validEnd]);
  return (
    <>
      <WizardTitle title={WIZARD_TITLES.schedule} />
      <Form className="schedule-tab">
        <ScheduleType
          isFuture={isFuture}
          setIsFuture={newValue => {
            if (!newValue) {
              // if schedule type is execute now
              setScheduleValue(current => ({
                ...current,
                startsAt: '',
                startsBefore: '',
                isFuture: newValue,
              }));
            } else {
              setScheduleValue(current => ({
                ...current,
                startsAt: new Date().toISOString(),
                isFuture: newValue,
              }));
            }
          }}
        />

        <RepeatOn
          repeatType={repeatType}
          repeatData={repeatData}
          setRepeatType={newValue => {
            setScheduleValue(current => ({
              ...current,
              repeatType: newValue,
              startsBefore: '',
            }));
          }}
          setRepeatData={newValue => {
            setScheduleValue(current => ({
              ...current,
              repeatData: newValue,
            }));
          }}
          repeatAmount={repeatAmount}
          setRepeatAmount={newValue => {
            setScheduleValue(current => ({
              ...current,
              repeatAmount: newValue,
            }));
          }}
        />
        <StartEndDates
          startsAt={startsAt}
          setStartsAt={newValue => {
            if (!isFuture) {
              setScheduleValue(current => ({
                ...current,
                isFuture: true,
              }));
            }
            setScheduleValue(current => ({
              ...current,
              startsAt: newValue,
            }));
          }}
          startsBefore={startsBefore}
          setStartsBefore={newValue => {
            if (!isFuture) {
              setScheduleValue(current => ({
                ...current,
                isFuture: true,
              }));
            }
            setScheduleValue(current => ({
              ...current,
              startsBefore: newValue,
            }));
          }}
          ends={ends}
          setEnds={newValue => {
            setScheduleValue(current => ({
              ...current,
              ends: newValue,
            }));
          }}
          isNeverEnds={isNeverEnds}
          setIsNeverEnds={newValue => {
            setScheduleValue(current => ({
              ...current,
              isNeverEnds: newValue,
            }));
          }}
          validEnd={validEnd}
          setValidEnd={setValidEnd}
          isFuture={isFuture}
          isStartBeforeDisabled={repeatType !== repeatTypes.noRepeat}
          isEndDisabled={repeatType === repeatTypes.noRepeat}
        />
        <QueryType
          isTypeStatic={isTypeStatic}
          setIsTypeStatic={newValue => {
            setScheduleValue(current => ({
              ...current,
              isTypeStatic: newValue,
            }));
          }}
        />
        <PurposeField
          isDisabled={repeatType === repeatTypes.noRepeat}
          purpose={purpose}
          setPurpose={newValue => {
            setScheduleValue(current => ({
              ...current,
              purpose: newValue,
            }));
          }}
        />
      </Form>
    </>
  );
};

Schedule.propTypes = {
  scheduleValue: PropTypes.shape({
    repeatType: PropTypes.string.isRequired,
    repeatAmount: PropTypes.string,
    repeatData: PropTypes.object,
    startsAt: PropTypes.string,
    startsBefore: PropTypes.string,
    ends: PropTypes.string,
    isFuture: PropTypes.bool,
    isNeverEnds: PropTypes.bool,
    isTypeStatic: PropTypes.bool,
    purpose: PropTypes.string,
  }).isRequired,
  setScheduleValue: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};

export default Schedule;
