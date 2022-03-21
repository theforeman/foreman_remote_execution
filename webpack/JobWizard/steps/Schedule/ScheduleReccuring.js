import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Radio,
  TextInput,
  ValidatedOptions,
  Divider,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { RepeatOn } from './RepeatOn';
import { SCHEDULE_TYPES } from '../../JobWizardConstants';
import { PurposeField } from './PurposeField';
import { DateTimePicker } from '../form/DateTimePicker';
import { WizardTitle } from '../form/WizardTitle';

export const ScheduleReccuring = ({
  scheduleValue,
  setScheduleValue,
  setValid,
}) => {
  const {
    repeatType,
    repeatAmount,
    repeatData,
    startsAt,
    startsBefore,
    ends,
    isNeverEnds,
    isFuture,
    purpose,
  } = scheduleValue;
  const [validEnd, setValidEnd] = useState(true);
  const [repeatValidated, setRepeatValidated] = useState('default');
  const handleRepeatInputChange = newValue => {
    setRepeatValidated(!newValue || newValue >= 1 ? 'default' : 'error');
    setScheduleValue(current => ({
      ...current,
      repeatAmount: newValue,
    }));
  };
  const [repeatValid, setRepeatValid] = useState(true);

  useEffect(() => {
    if (isNeverEnds) setValidEnd(true);
    else if (!ends) setValidEnd(true);
    else if (
      !startsAt.length &&
      new Date().getTime() <= new Date(ends).getTime()
    )
      setValidEnd(true);
    else if (new Date(startsAt).getTime() <= new Date(ends).getTime())
      setValidEnd(true);
    else {
      setValidEnd(false);
    }

    if (!validEnd || !repeatValid) {
      setValid(false);
    } else if (isFuture && startsAt.length) {
      setValid(true);
    } else if (!isFuture) {
      setValid(true);
    } else {
      setValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startsAt, startsBefore, isFuture, validEnd, repeatValid, ends]);

  return (
    <>
      <WizardTitle title={SCHEDULE_TYPES.RECCURING} />
      <Form className="schedule-tab">
        <FormGroup label={__('Starts')} fieldId="schedule-starts">
          <div className="pf-c-form">
            <FormGroup fieldId="schedule-starts-now">
              <Radio
                isChecked={!isFuture}
                onChange={() =>
                  setScheduleValue(current => ({
                    ...current,
                    startsAt: '',
                    startsBefore: '',
                    isFuture: false,
                  }))
                }
                name="start-now"
                id="start-now"
                label={__('Now')}
              />
            </FormGroup>
            <FormGroup fieldId="start-at-date">
              <Radio
                isChecked={isFuture}
                onChange={() =>
                  setScheduleValue(current => ({
                    ...current,
                    startsAt: new Date().toISOString(),
                    isFuture: true,
                  }))
                }
                name="start-at"
                id="start-at"
                className="schedule-radio"
                label={
                  <div className="scheudle-radio-wrapper">
                    <div className="schedule-radio-title">{__('At')}</div>
                    <DateTimePicker
                      ariaLabel="starts at"
                      dateTime={startsAt}
                      setDateTime={newValue =>
                        setScheduleValue(current => ({
                          ...current,
                          startsAt: newValue,
                        }))
                      }
                      isDisabled={!isFuture}
                    />
                  </div>
                }
              />
            </FormGroup>
          </div>
        </FormGroup>

        <Divider component="div" />
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
          setValid={setRepeatValid}
        />
        <Divider component="div" />
        <FormGroup label={__('Ends')} fieldId="schedule-ends">
          <div className="pf-c-form">
            <FormGroup fieldId="schedule-ends-never">
              <Radio
                isChecked={isNeverEnds}
                onChange={() =>
                  setScheduleValue(current => ({
                    ...current,
                    isNeverEnds: true,
                    ends: null,
                    repeatAmount: null,
                  }))
                }
                name="never-ends"
                id="never-ends"
                label={__('Never')}
              />
            </FormGroup>
            <FormGroup
              fieldId="ends-on-date"
              validated={
                validEnd ? ValidatedOptions.noval : ValidatedOptions.error
              }
              helperTextInvalid={__('End time needs to be after start time')}
              helperTextInvalidIcon={<ExclamationCircleIcon />}
            >
              <Radio
                isChecked={!!ends}
                onChange={() =>
                  setScheduleValue(current => ({
                    ...current,
                    ends: new Date().toISOString(),
                    isNeverEnds: false,
                    repeatAmount: null,
                  }))
                }
                name="ends-on"
                id="ends-on"
                className="schedule-radio"
                label={
                  <div className="scheudle-radio-wrapper">
                    <div className="schedule-radio-title">{__('On')}</div>
                    <DateTimePicker
                      ariaLabel="ends on"
                      dateTime={ends}
                      isDisabled={!ends}
                      setDateTime={newValue => {
                        setScheduleValue(current => ({
                          ...current,
                          ends: newValue,
                        }));
                      }}
                    />
                  </div>
                }
              />
            </FormGroup>
            <FormGroup fieldId="ends-after">
              <Radio
                isChecked={!!repeatAmount}
                onChange={() =>
                  setScheduleValue(current => ({
                    ...current,
                    ends: null,
                    isNeverEnds: false,
                    repeatAmount: 1,
                  }))
                }
                name="ends-after"
                id="ends-after"
                className="schedule-radio"
                label={
                  <div className="scheudle-radio-wrapper">
                    <div className="schedule-radio-title">{__('After')}</div>
                    <FormGroup
                      helperTextInvalid={__(
                        'Repeat amount can only be a positive number'
                      )}
                      validated={repeatValidated}
                      className="schedule-radio-repeat-text"
                    >
                      <TextInput
                        id="repeat-amount"
                        value={repeatAmount || ''}
                        type="number"
                        onChange={handleRepeatInputChange}
                        isDisabled={!repeatAmount}
                      />
                    </FormGroup>
                    <div className="schedule-radio-occurences">
                      {__('occurences')}
                    </div>
                  </div>
                }
              />
            </FormGroup>
          </div>
        </FormGroup>
        <Divider component="div" />
        <PurposeField
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

ScheduleReccuring.propTypes = {
  scheduleValue: PropTypes.shape({
    repeatType: PropTypes.string.isRequired,
    repeatAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    repeatData: PropTypes.object,
    startsAt: PropTypes.string,
    startsBefore: PropTypes.string,
    ends: PropTypes.string,
    isFuture: PropTypes.bool,
    isNeverEnds: PropTypes.bool,
    purpose: PropTypes.string,
  }).isRequired,
  setScheduleValue: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
