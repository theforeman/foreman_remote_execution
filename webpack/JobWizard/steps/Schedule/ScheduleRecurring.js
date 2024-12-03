import React, { useEffect, useState, useCallback } from 'react';
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

export const ScheduleRecurring = ({
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
    if (!newValue.length) newValue = 0;
    setRepeatValidated(
      !newValue || parseInt(newValue, 10) >= 1 ? 'default' : 'error'
    );
    setScheduleValue(current => ({
      ...current,
      repeatAmount: newValue,
    }));
  };
  const [repeatValid, setRepeatValid] = useState(true);

  const wrappedSetValid = useCallback(setValid, []);
  useEffect(() => {
    if (isNeverEnds) setValidEnd(true);
    else if (!ends) setValidEnd(true);
    else if (
      !startsAt?.length &&
      new Date().getTime() <= new Date(ends).getTime()
    )
      setValidEnd(true);
    else if (new Date(startsAt).getTime() <= new Date(ends).getTime())
      setValidEnd(true);
    else {
      setValidEnd(false);
    }

    if (!validEnd || !repeatValid) {
      wrappedSetValid(false);
    } else if (isFuture && startsAt?.length) {
      wrappedSetValid(true);
    } else if (!isFuture) {
      wrappedSetValid(true);
    } else {
      wrappedSetValid(false);
    }
  }, [
    wrappedSetValid,
    isNeverEnds,
    startsAt,
    startsBefore,
    isFuture,
    validEnd,
    repeatValid,
    ends,
  ]);

  return (
    <>
      <WizardTitle title={SCHEDULE_TYPES.RECURRING} />
      <Form className="schedule-tab">
        <FormGroup label={__('Starts')} fieldId="schedule-starts">
          <div className="pf-c-form">
            <FormGroup fieldId="schedule-starts-now">
              <Radio
                ouiaId="schedule-start-now"
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
                ouiaId="schedule-start-at-date"
                isChecked={isFuture}
                onChange={() =>
                  setScheduleValue(current => ({
                    ...current,
                    startsAt: new Date(
                      new Date().getTime() + 60000
                    ).toISOString(), // 1 minute in the future
                    isFuture: true,
                  }))
                }
                name="start-at"
                id="start-at"
                className="schedule-radio"
                label={
                  <div className="schedule-radio-wrapper">
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
                ouiaId="schedule-never-ends"
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
                ouiaId="schedule-ends-on-date"
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
                  <div className="schedule-radio-wrapper">
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
                ouiaId="schedule-ends-after"
                isChecked={repeatAmount === 0 || !!repeatAmount}
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
                  <div className="schedule-radio-wrapper">
                    <div className="schedule-radio-title">{__('After')}</div>
                    <FormGroup
                      helperTextInvalid={__(
                        'Repeat amount can only be a positive number'
                      )}
                      validated={repeatValidated}
                      className="schedule-radio-repeat-text"
                    >
                      <TextInput
                        ouiaId="repeat-amount"
                        id="repeat-amount"
                        value={repeatAmount || ''}
                        type="number"
                        onChange={handleRepeatInputChange}
                        isDisabled={!(repeatAmount === 0 || !!repeatAmount)}
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

ScheduleRecurring.propTypes = {
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
