/* eslint-disable max-lines */
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { fireEvent, screen, render, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import { jobTemplate, jobTemplateResponse } from '../../../__tests__/fixtures';

const lodash = require('lodash');

lodash.debounce = fn => fn;
jest.spyOn(api, 'get');
jest.spyOn(selectors, 'selectJobTemplate');
jest.spyOn(selectors, 'selectJobTemplates');
jest.spyOn(selectors, 'selectJobCategories');

const jobCategories = ['Ansible Commands', 'Puppet', 'Services'];

selectors.selectJobCategories.mockImplementation(() => jobCategories);

selectors.selectJobTemplates.mockImplementation(() => [
  jobTemplate,
  { ...jobTemplate, id: 2, name: 'template2' },
]);
selectors.selectJobTemplate.mockImplementation(() => jobTemplateResponse);
api.get.mockImplementation(({ handleSuccess, ...action }) => {
  if (action.key === 'JOB_CATEGORIES') {
    handleSuccess && handleSuccess({ data: { job_categories: jobCategories } });
  } else if (action.key === 'JOB_TEMPLATE') {
    handleSuccess &&
      handleSuccess({
        data: jobTemplateResponse,
      });
  } else if (action.key === 'JOB_TEMPLATES') {
    handleSuccess &&
      handleSuccess({
        data: { results: [jobTemplateResponse.job_template] },
      });
  }
  return { type: 'get', ...action };
});

const mockStore = configureMockStore([]);
const store = mockStore({});
jest.useFakeTimers();

describe('Schedule', () => {
  it('should save date time between steps ', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Schedule'));
    });
    const newStartDate = '2020/03/12';
    const newStartTime = '12:03';
    const newEndsDate = '2030/03/12';
    const newEndsTime = '17:34';
    const startsDateField = screen.getByLabelText('starts at datepicker');
    const endsDateField = screen.getByLabelText('ends datepicker');

    const startsTimeField = screen.getByLabelText('starts at timepicker');
    const endsTimeField = screen.getByLabelText('ends timepicker');

    const staticQuery = screen.getByLabelText('Static query');
    const dynamicQuery = screen.getByLabelText('Dynamic query');
    const purpose = screen.getByLabelText('purpose');
    const newPurposeLabel = 'some fun text';
    expect(staticQuery.checked).toBeTruthy();
    await act(async () => {
      await fireEvent.change(startsDateField, {
        target: { value: newStartDate },
      });
      await fireEvent.change(startsTimeField, {
        target: { value: newStartTime },
      });
      await fireEvent.change(purpose, {
        target: { value: newPurposeLabel },
      });
      await fireEvent.change(endsDateField, { target: { value: newEndsDate } });
      await fireEvent.change(endsTimeField, { target: { value: newEndsTime } });

      await fireEvent.click(dynamicQuery);
      jest.runAllTimers(); // to handle pf4 date picker popover useTimer
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    expect(screen.getAllByText('Category and Template')).toHaveLength(3);

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule'));
      jest.runAllTimers();
    });
    expect(startsDateField.value).toBe(newStartDate);
    expect(startsTimeField.value).toBe(newStartTime);
    expect(endsDateField.value).toBe(newEndsDate);
    expect(endsTimeField.value).toBe(newEndsTime);
    expect(dynamicQuery.checked).toBeTruthy();
    expect(purpose.value).toBe(newPurposeLabel);
  });
  it('should remove start date time on execute now', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Schedule'));
    });
    const executeNow = screen.getByLabelText('Execute now');
    const executeFuture = screen.getByLabelText(
      'Schedule for future execution'
    );
    expect(executeNow.checked).toBeTruthy();
    const newStartDate = '2020/03/12';
    const newStartTime = '12:03';
    const startsDateField = screen.getByLabelText('starts at datepicker');
    const startsTimeField = screen.getByLabelText('starts at timepicker');
    await act(async () => {
      await fireEvent.change(startsDateField, {
        target: { value: newStartDate },
      });
      await fireEvent.change(startsTimeField, {
        target: { value: newStartTime },
      });
      await jest.runOnlyPendingTimers();
    });
    expect(startsDateField.value).toBe(newStartDate);
    expect(startsTimeField.value).toBe(newStartTime);
    expect(executeFuture.checked).toBeTruthy();
    await act(async () => {
      await fireEvent.click(executeNow);
      jest.runAllTimers();
    });
    expect(executeNow.checked).toBeTruthy();
    expect(startsDateField.value).toBe('');
    expect(startsTimeField.value).toBe('');
  });

  it('should disable end date on never ends', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      await fireEvent.click(screen.getByText('Schedule'));
      jest.runAllTimers();
    });
    const neverEnds = screen.getByLabelText('Never ends');
    expect(neverEnds.checked).toBeFalsy();

    const endsDateField = screen.getByLabelText('ends datepicker');
    const endsTimeField = screen.getByLabelText('ends timepicker');
    fireEvent.click(
      screen.getByLabelText('Does not repeat', { selector: 'button' })
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Cronline'));
    });
    expect(endsDateField.disabled).toBeFalsy();
    expect(endsTimeField.disabled).toBeFalsy();
    await act(async () => {
      fireEvent.click(neverEnds);
    });
    expect(neverEnds.checked).toBeTruthy();
    expect(endsDateField.disabled).toBeTruthy();
    expect(endsTimeField.disabled).toBeTruthy();
  });

  it('should change between repeat on states', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Schedule'));
      jest.runAllTimers(); // to handle pf4 date picker popover useTimer
    });
    expect(
      screen.getByPlaceholderText('Repeat N times').hasAttribute('disabled')
    ).toBeTruthy();
    expect(screen.getByText('Review Details').disabled).toBeFalsy();
    await act(async () => {
      fireEvent.click(
        screen.getByLabelText('Does not repeat', { selector: 'button' })
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Cronline'));
    });
    expect(screen.getByText('Review Details').disabled).toBeTruthy();
    const newRepeatTimes = '3';
    const repeatNTimes = screen.getByPlaceholderText('Repeat N times');
    expect(repeatNTimes.value).toBe('');
    await act(async () => {
      fireEvent.change(repeatNTimes, {
        target: { value: newRepeatTimes },
      });
    });
    expect(repeatNTimes.value).toBe(newRepeatTimes);

    const newCronline = '1 2';
    const cronline = screen.getByLabelText('cronline');
    expect(cronline.value).toBe('');
    await act(async () => {
      fireEvent.change(cronline, {
        target: { value: newCronline },
      });
    });
    expect(cronline.value).toBe(newCronline);
    expect(screen.getByText('Review Details').disabled).toBeFalsy();

    await act(async () => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    expect(screen.getAllByText('Category and Template')).toHaveLength(3);

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule'));
      jest.runAllTimers();
    });
    expect(screen.queryAllByText('Schedule')).toHaveLength(3);
    expect(repeatNTimes.value).toBe(newRepeatTimes);
    expect(cronline.value).toBe(newCronline);

    fireEvent.click(screen.getByText('Cronline'));
    await act(async () => {
      fireEvent.click(screen.getByText('Monthly'));
    });

    expect(screen.getByText('Review Details').disabled).toBeTruthy();
    const newDays = '1,2,3';
    const days = screen.getByLabelText('days');
    expect(days.value).toBe('');
    await act(async () => {
      fireEvent.change(days, {
        target: { value: newDays },
      });
      fireEvent.click(repeatNTimes);
    });
    expect(days.value).toBe(newDays);

    expect(screen.getByText('Review Details').disabled).toBeTruthy();
    const newAtMonthly = '13:07';
    const at = () => screen.getByLabelText('repeat-at');
    expect(at().value).toBe('');
    await act(async () => {
      fireEvent.change(at(), {
        target: { value: newAtMonthly },
      });
    });
    expect(at().value).toBe(newAtMonthly);

    expect(screen.getByText('Review Details').disabled).toBeFalsy();
    fireEvent.click(screen.getByText('Monthly'));
    await act(async () => {
      fireEvent.click(screen.getByText('Weekly'));
    });

    expect(screen.getByText('Review Details').disabled).toBeTruthy();
    const dayTue = screen.getByLabelText('Tue checkbox');
    const daySat = screen.getByLabelText('Sat checkbox');
    expect(dayTue.checked).toBe(false);
    expect(daySat.checked).toBe(false);
    await act(async () => {
      fireEvent.click(dayTue);
      fireEvent.change(dayTue, {
        target: { checked: true },
      });
    });
    await act(async () => {
      fireEvent.click(daySat);
      fireEvent.change(daySat, {
        target: { checked: true },
      });
    });
    expect(dayTue.checked).toBe(true);
    expect(daySat.checked).toBe(true);
    const newAtWeekly = '17:53';
    expect(at().value).toBe(newAtMonthly);
    await act(async () => {
      fireEvent.change(at(), {
        target: { value: newAtWeekly },
      });
    });
    expect(at().value).toBe(newAtWeekly);

    expect(screen.getByText('Review Details').disabled).toBeFalsy();
    fireEvent.click(screen.getByText('Weekly'));
    await act(async () => {
      fireEvent.click(screen.getByText('Daily'));
    });

    expect(screen.getByText('Review Details').disabled).toBeFalsy();
    await act(async () => {
      fireEvent.change(at(), {
        target: { value: '' },
      });
    });
    expect(screen.getByText('Review Details').disabled).toBeTruthy();
    const newAtDaily = '17:07';
    expect(at().value).toBe('');
    await act(async () => {
      fireEvent.change(at(), {
        target: { value: newAtDaily },
      });
    });
    expect(at().value).toBe(newAtDaily);
    expect(screen.getByText('Review Details').disabled).toBeFalsy();

    fireEvent.click(screen.getByText('Daily'));
    await act(async () => {
      fireEvent.click(screen.getByText('Hourly'));
    });

    expect(screen.getByText('Review Details').disabled).toBeTruthy();
    const newMinutes = '6';
    const atHourly = screen.getByLabelText('repeat-at-minute-typeahead');
    expect(atHourly.value).toBe('');
    await act(async () => {
      fireEvent.click(screen.getByLabelText('select minute toggle'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText(newMinutes));
    });
    expect(screen.getByText('Review Details').disabled).toBeFalsy();
    expect(atHourly.value).toBe(newMinutes);
  });
  it('should show invalid error on start date after end', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      await fireEvent.click(screen.getByText('Schedule'));
      jest.runAllTimers();
    });
    const neverEnds = screen.getByLabelText('Never ends');
    expect(neverEnds.checked).toBeFalsy();

    const startsDateField = screen.getByLabelText('starts at datepicker');
    const endsDateField = screen.getByLabelText('ends datepicker');

    expect(
      screen.queryAllByText('End time needs to be after start time')
    ).toHaveLength(0);
    expect(screen.getByText('Review Details').disabled).toBeFalsy();
    await act(async () => {
      await fireEvent.change(startsDateField, {
        target: { value: '2020/10/15' },
      });
      await fireEvent.change(endsDateField, {
        target: { value: '2020/10/14' },
      });
      await jest.runOnlyPendingTimers();
    });

    expect(
      screen.queryAllByText('End time needs to be after start time')
    ).toHaveLength(1);

    expect(screen.getByText('Review Details').disabled).toBeTruthy();
  });
  it('purpose and ends should be disabled when no reaccurence ', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      await fireEvent.click(screen.getByText('Schedule'));
      jest.runAllTimers();
    });

    const endsDateField = screen.getByLabelText('ends datepicker');
    const endsTimeField = screen.getByLabelText('ends timepicker');
    const purpose = screen.getByLabelText('purpose');
    expect(endsDateField.disabled).toBeTruthy();
    expect(endsTimeField.disabled).toBeTruthy();
    expect(purpose.disabled).toBeTruthy();
    await act(async () => {
      fireEvent.click(
        screen.getByLabelText('Does not repeat', { selector: 'button' })
      );
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Cronline'));
    });
    expect(endsDateField.disabled).toBeFalsy();
    expect(endsTimeField.disabled).toBeFalsy();
    expect(purpose.disabled).toBeFalsy();
  });
});
