import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Checkbox } from '@patternfly/react-core';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';

const getWeekDays = () => {
  const locale = documentLocale().replace(/-/g, '_');
  const baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    try {
      weekDays.push(baseDate.toLocaleDateString(locale, { weekday: 'short' }));
    } catch {
      weekDays.push(baseDate.toLocaleDateString('en', { weekday: 'short' }));
    }
    baseDate.setDate(baseDate.getDate() + 1);
  }
  return weekDays;
};

export const RepeatWeek = ({ repeatData, setRepeatData }) => {
  const days = getWeekDays();
  const handleChangeDays = (checked, { target: { name } }) => {
    setRepeatData({
      daysOfWeek: { ...repeatData.daysOfWeek, [name]: checked },
    });
  };
  return (
    <FormGroup label={__('Days of week')}>
      <div id="repeat-on-weekly">
        {days.map((day, index) => (
          <Checkbox
            key={index}
            isChecked={repeatData.daysOfWeek?.[index]}
            name={index}
            id={`repeat-on-day-${index}`}
            onChange={handleChangeDays}
            label={day}
          />
        ))}
      </div>
    </FormGroup>
  );
};
RepeatWeek.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
};
