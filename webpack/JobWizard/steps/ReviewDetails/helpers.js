import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { getWeekDays } from '../Schedule/RepeatWeek';
import { repeatTypes } from '../../JobWizardConstants';

export const parseEnd = (ends, isNeverEnds, repeatAmount) => {
  if (isNeverEnds) {
    return __('Never');
  }
  if (ends) {
    const endsDate = new Date(ends);
    return endsDate.toString();
  }
  return sprintf(__('After %s occurences'), repeatAmount);
};

export const parseRepeat = (repeatType, repeatData) => {
  switch (repeatType) {
    case repeatTypes.hourly:
      return sprintf(__('Every hour at minute %s'), repeatData.minute);
    case repeatTypes.daily:
      return sprintf(__('Every day at %s'), repeatData.at);
    case repeatTypes.weekly: {
      const daysKeys = Object.keys(repeatData.daysOfWeek).filter(
        k => repeatData.daysOfWeek[k]
      );
      const dayNames = getWeekDays();
      const days = daysKeys.map(day => dayNames[day]).join(', ');
      return sprintf(__('Every week on %s at %s'), days, repeatData.at);
    }
    case repeatTypes.monthly:
      return sprintf(
        __('Every month on %s at %s'),
        repeatData.days,
        repeatData.at
      );
    case repeatTypes.cronline:
      return `${__('Cron line')} - ${repeatData.cronline}`;

    default:
      return '';
  }
};
