import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { ScheduleType } from './ScheduleType';
import { RepeatOn } from './RepeatOn';
import { QueryType } from './QueryType';
import { StartEndDates } from './StartEndDates';
import { WIZARD_TITLES } from '../../JobWizardConstants';
import { WizardTitle } from '../form/WizardTitle';

const Schedule = ({ scheduleValue, setScheduleValue }) => {
  const {
    repeatType,
    repeatAmount,
    repeatData,
    starts,
    ends,
    isNeverEnds,
    isFuture,
    isTypeStatic,
  } = scheduleValue;
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
                starts: '',
              }));
            }
            setScheduleValue(current => ({
              ...current,
              isFuture: newValue,
            }));
          }}
        />

        <RepeatOn
          repeatType={repeatType}
          repeatData={repeatData}
          setRepeatType={newValue => {
            setScheduleValue(current => ({
              ...current,
              repeatType: newValue,
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
          starts={starts}
          setStarts={newValue => {
            if (!isFuture) {
              setScheduleValue(current => ({
                ...current,
                isFuture: true,
              }));
            }
            setScheduleValue(current => ({
              ...current,
              starts: newValue,
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
        />
        <Button variant="link" className="advanced-scheduling-button" isInline>
          {__('Advanced scheduling')}
        </Button>
        <QueryType
          isTypeStatic={isTypeStatic}
          setIsTypeStatic={newValue => {
            setScheduleValue(current => ({
              ...current,
              isTypeStatic: newValue,
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
    starts: PropTypes.string,
    ends: PropTypes.string,
    isFuture: PropTypes.bool,
    isNeverEnds: PropTypes.bool,
    isTypeStatic: PropTypes.bool,
  }).isRequired,
  setScheduleValue: PropTypes.func.isRequired,
};

export default Schedule;
