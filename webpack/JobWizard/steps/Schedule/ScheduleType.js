import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Radio, Divider } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  WIZARD_TITLES,
  SCHEDULE_TYPES,
  repeatTypes,
} from '../../JobWizardConstants';
import { WizardTitle } from '../form/WizardTitle';
import { QueryType } from './QueryType';

export const ScheduleType = ({
  scheduleType,
  isTypeStatic,
  setScheduleValue,
  setValid,
}) => (
  <div className="schedule-tab">
    <WizardTitle title={WIZARD_TITLES.schedule} />
    <Form>
      <FormGroup
        fieldId="schedule-type-now"
        label={__('Select the type of execution')}
      >
        <Radio
          isChecked={scheduleType === SCHEDULE_TYPES.NOW}
          name="schedule-type-now"
          id="schedule-type-now"
          onChange={() => {
            setScheduleValue(current => ({
              ...current,
              scheduleType: SCHEDULE_TYPES.NOW,
              repeatType: repeatTypes.noRepeat,
              startsAt: null,
              startsBefore: null,
            }));
            setValid(true);
          }}
          label={__('Immediate execution')}
          body={__('Execute job now.')}
        />
      </FormGroup>
      <FormGroup fieldId="schedule-type-future">
        <Radio
          isChecked={scheduleType === SCHEDULE_TYPES.FUTURE}
          onChange={() => {
            setScheduleValue(current => ({
              ...current,
              startsAt: new Date().toISOString(),
              scheduleType: SCHEDULE_TYPES.FUTURE,
              repeatType: repeatTypes.noRepeat,
            }));
            setValid(true);
          }}
          name="schedule-type-future"
          id="schedule-type-future"
          label={__('Future execution')}
          body={__('Plan executing job in the future.')}
        />
      </FormGroup>
      <FormGroup fieldId="schedule-type-reccuring">
        <Radio
          isChecked={scheduleType === SCHEDULE_TYPES.RECCURING}
          onChange={() => {
            setScheduleValue(current => ({
              ...current,
              scheduleType: SCHEDULE_TYPES.RECCURING,
              repeatType: repeatTypes.daily,
              repeatData: { at: new Date() },
            }));
            setValid(true);
          }}
          name="schedule-type-reccuring"
          id="schedule-type-reccuring"
          label={__('Recurring execution')}
          body={__('Set up a reccuring execution for a job.')}
        />
      </FormGroup>
      <Divider component="div" />
      <QueryType
        isTypeStatic={isTypeStatic}
        setIsTypeStatic={newValue => {
          setScheduleValue(current => ({ ...current, isTypeStatic: newValue }));
        }}
      />
    </Form>
  </div>
);

ScheduleType.propTypes = {
  isTypeStatic: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  setScheduleValue: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
