import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DatePicker,
  TimePicker,
  ValidatedOptions,
} from '@patternfly/react-core';
import { debounce } from 'lodash';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';

export const DateTimePicker = ({
  dateTime,
  setDateTime,
  isDisabled,
  ariaLabel,
  allowEmpty,
}) => {
  const [validated, setValidated] = useState();
  const dateFormat = date =>
    `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;

  const dateObject = dateTime ? new Date(dateTime) : new Date();
  const formattedDate = dateTime ? dateFormat(dateObject) : '';
  const dateParse = date =>
    new Date(`${date} ${dateObject.getHours()}:${dateObject.getMinutes()}`);

  const isValidDate = date => date && !Number.isNaN(date.getTime());

  const isValidTime = time => {
    if (!time) return false;
    const split = time.split(':');
    if (!(split[0].length === 2 && split[1].length === 2)) return false;
    if (isValidDate(new Date(`${formattedDate} ${time}`))) return true;
    if (!formattedDate.length && isValidDate(new Date(`01/01/2020 ${time}`))) {
      const today = new Date();
      today.setHours(split[0]);
      today.setMinutes(split[1]);
      setDateTime(today.toString());
    }
    return false;
  };

  const onDateChange = newDate => {
    const parsedNewDate = new Date(newDate);
    if (!newDate.length && allowEmpty) {
      setDateTime('');
      setValidated(ValidatedOptions.noval);
    } else if (isValidDate(parsedNewDate)) {
      parsedNewDate.setHours(dateObject.getHours());
      parsedNewDate.setMinutes(dateObject.getMinutes());
      setDateTime(parsedNewDate.toString());
      setValidated(ValidatedOptions.noval);
    } else {
      setValidated(ValidatedOptions.error);
    }
  };

  const onTimeChange = newTime => {
    if (!newTime.length && allowEmpty) {
      const parsedNewTime = new Date(`${formattedDate} 00:00`);
      setDateTime(parsedNewTime.toString());
      setValidated(ValidatedOptions.noval);
    } else if (isValidTime(newTime)) {
      const parsedNewTime = new Date(`${formattedDate} ${newTime}`);
      setDateTime(parsedNewTime.toString());
      setValidated(ValidatedOptions.noval);
    } else {
      setValidated(ValidatedOptions.error);
    }
  };
  return (
    <>
      <DatePicker
        aria-label={`${ariaLabel} datepicker`}
        value={formattedDate}
        placeholder="yyyy/mm/dd"
        onChange={debounce(onDateChange, 1000, {
          leading: false,
          trailing: true,
        })}
        dateFormat={dateFormat}
        dateParse={dateParse}
        isDisabled={isDisabled}
        locale={documentLocale()}
        invalidFormatText={
          validated === ValidatedOptions.error ? __('Invalid date') : ''
        }
        inputProps={{ validated }}
      />
      <TimePicker
        aria-label={`${ariaLabel} timepicker`}
        className="time-picker"
        time={dateTime ? dateObject.toString() : ''}
        inputProps={dateTime ? {} : { value: '' }}
        placeholder="hh:mm"
        onChange={debounce(onTimeChange, 1000, {
          leading: false,
          trailing: true,
        })}
        is24Hour
        isDisabled={isDisabled}
        invalidFormatErrorMessage={__('Invalid time format')}
        menuAppendTo={() => document.body}
      />
    </>
  );
};

DateTimePicker.propTypes = {
  dateTime: PropTypes.string,
  setDateTime: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  allowEmpty: PropTypes.bool,
};
DateTimePicker.defaultProps = {
  dateTime: null,
  isDisabled: false,
  ariaLabel: '',
  allowEmpty: true,
};
