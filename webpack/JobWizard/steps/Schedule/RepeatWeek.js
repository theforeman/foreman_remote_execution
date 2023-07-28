import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Checkbox } from '@patternfly/react-core';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';
import { RepeatDaily } from './RepeatDaily';
import { noop } from '../../../helpers';

const getWeekDays = () => {
  const locale = documentLocale().replace(/-/g, '_');
  const baseDate = new Date(Date.UTC(2017, 0, 1)); // just a Sunday
  const weekDays = [];
  const formatOptions = { weekday: 'short', timeZone: 'UTC' };
  for (let i = 0; i < 7; i++) {
    try {
      weekDays.push(baseDate.toLocaleDateString(locale, formatOptions));
    } catch {
      weekDays.push(baseDate.toLocaleDateString('en', formatOptions));
    }
    baseDate.setDate(baseDate.getDate() + 1);
  }
  return weekDays;
};

export const RepeatWeek = ({ repeatData, setRepeatData, setValid }) => {
  const { daysOfWeek, at } = repeatData;
  useEffect(() => {
    if (daysOfWeek && Object.values(daysOfWeek).includes(true) && at) {
      setValid(true);
    } else {
      setValid(false);
    }
    return () => setValid(true);
  }, [setValid, daysOfWeek, at]);
  const days = getWeekDays();
  const handleChangeDays = (checked, { target: { name } }) => {
    setRepeatData({
      ...repeatData,
      daysOfWeek: { ...repeatData.daysOfWeek, [name]: checked },
    });
  };
  return (
    <>
      <FormGroup label={__('Days of week')} isRequired>
        <div id="repeat-on-weekly">
          {days.map((day, index) => (
            <Checkbox
              aria-label={`${day} checkbox`}
              key={index}
              isChecked={daysOfWeek?.[index]}
              name={index}
              id={`repeat-on-day-${index}`}
              onChange={handleChangeDays}
              label={day}
            />
          ))}
        </div>
      </FormGroup>

      <RepeatDaily
        repeatData={repeatData}
        setRepeatData={setRepeatData}
        setValid={noop}
      />
    </>
  );
};
RepeatWeek.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
