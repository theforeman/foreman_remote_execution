/* eslint-disable max-lines */
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { fireEvent, screen, render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
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
  it('sub steps appear', () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Type of execution'));
    });
    expect(screen.getAllByText('Future execution')).toHaveLength(1);
    expect(screen.getAllByText('Recurring execution')).toHaveLength(1);

    act(() => {
      fireEvent.click(screen.getByText('Future execution'));
    });
    expect(screen.getAllByText('Future execution')).toHaveLength(2);
    expect(screen.getAllByText('Recurring execution')).toHaveLength(1);
    act(() => {
      fireEvent.click(screen.getByText('Recurring execution'));
    });
    expect(screen.getAllByText('Future execution')).toHaveLength(1);
    expect(screen.getAllByText('Recurring execution')).toHaveLength(2);
  });
  it('Future execution', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Type of execution'));
    });
    act(() => {
      fireEvent.click(screen.getByText('Future execution'));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Future execution' }));
      jest.runAllTimers(); // to handle pf4 date picker popover useTimer
    });

    const newStartAtDate = '2030/03/12';
    const newStartBeforeDate = '2030/05/22';
    const newStartAtTime = '12:46';
    const newStartBeforeTime = '14:27';
    const startsAtDateField = () =>
      screen.getByLabelText('starts at datepicker');
    const startsAtTimeField = () =>
      screen.getByLabelText('starts at timepicker');

    const startsBeforeDateField = () =>
      screen.getByLabelText('starts before datepicker');
    const startsBeforeTimeField = () =>
      screen.getByLabelText('starts before timepicker');

    await act(async () => {
      await fireEvent.change(startsAtDateField(), {
        target: { value: newStartAtDate },
      });
      fireEvent.change(startsAtTimeField(), {
        target: { value: newStartAtTime },
      });
      await fireEvent.change(startsBeforeDateField(), {
        target: { value: newStartBeforeDate },
      });
      fireEvent.change(startsBeforeTimeField(), {
        target: { value: newStartBeforeTime },
      });
      jest.runOnlyPendingTimers();
    });

    act(() => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Future execution' }));
      jest.runAllTimers(); // to handle pf4 date picker popover useTimer
    });
    expect(startsAtDateField().value).toBe(newStartAtDate);
    expect(startsAtTimeField().value).toBe(newStartAtTime);
    expect(startsBeforeDateField().value).toBe(newStartBeforeDate);
    expect(startsBeforeTimeField().value).toBe(newStartBeforeTime);

    expect(
      screen.queryAllByText(
        "'Starts before' date must be after 'Starts at' date"
      )
    ).toHaveLength(0);
    await act(async () => {
      await fireEvent.change(startsBeforeDateField(), {
        target: { value: '2030/03/11' },
      });
      await fireEvent.click(startsBeforeTimeField());
      await jest.runOnlyPendingTimers();
    });
    expect(startsBeforeDateField().value).toBe('2030/03/11');
    expect(
      screen.getAllByText("'Starts before' date must be after 'Starts at' date")
    ).toHaveLength(1);

    expect(
      screen.queryAllByText("'Starts before' date must in the future")
    ).toHaveLength(0);
    await act(async () => {
      await fireEvent.change(startsBeforeDateField(), {
        target: { value: '2019/03/11' },
      });
      await fireEvent.change(startsAtDateField(), {
        target: { value: '' },
      });
      jest.runOnlyPendingTimers();
    });

    expect(startsBeforeDateField().value).toBe('2019/03/11');
    expect(
      screen.getAllByText("'Starts before' date must in the future")
    ).toHaveLength(1);
  });

  it('Recurring execution - date pickers', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Type of execution'));
    });
    act(() => {
      fireEvent.click(screen.getByText('Recurring execution'));
    });
    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Recurring execution' })
      );
      jest.runAllTimers(); // to handle pf4 date picker popover useTimer
    });

    const newStartAtDate = '2030/03/12';
    const newStartAtTime = '12:46';
    const startsAtDateField = () =>
      screen.getByLabelText('starts at datepicker');
    const startsAtTimeField = () =>
      screen.getByLabelText('starts at timepicker');

    const endsAtDateField = () => screen.getByLabelText('ends on datepicker');
    const endsAtTimeField = () => screen.getByLabelText('ends on timepicker');

    expect(startsAtDateField().disabled).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getAllByText('At')[0]);
    });
    expect(startsAtDateField().disabled).toBeFalsy();
    await act(async () => {
      await fireEvent.change(startsAtDateField(), {
        target: { value: newStartAtDate },
      });
      fireEvent.change(startsAtTimeField(), {
        target: { value: newStartAtTime },
      });
      jest.runOnlyPendingTimers();
    });

    expect(endsAtDateField().disabled).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByText('On'));
    });
    expect(endsAtDateField().disabled).toBeFalsy();
    await act(async () => {
      await fireEvent.change(endsAtDateField(), {
        target: { value: newStartAtDate },
      });
      fireEvent.change(endsAtTimeField(), {
        target: { value: newStartAtTime },
      });
      jest.runOnlyPendingTimers();
    });

    act(() => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Recurring execution' })
      );
      jest.runAllTimers(); // to handle pf4 date picker popover useTimer
    });
    expect(startsAtDateField().value).toBe(newStartAtDate);
    expect(startsAtTimeField().value).toBe(newStartAtTime);
    expect(endsAtDateField().value).toBe(newStartAtDate);
    expect(endsAtTimeField().value).toBe(newStartAtTime);

    act(() => {
      fireEvent.click(screen.getByText('Now'));
      fireEvent.click(screen.getByText('After'));
    });
    expect(startsAtDateField().disabled).toBeTruthy();
    expect(endsAtDateField().disabled).toBeTruthy();
    expect(startsAtDateField().value).toBe('');
    expect(startsAtTimeField().value).toBe('');
    expect(endsAtDateField().value).toBe('');
    expect(endsAtTimeField().value).toBe('');
  });
  it('Recurring execution - repeat', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Type of execution'));
    });
    act(() => {
      fireEvent.click(screen.getByText('Recurring execution'));
    });
    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Recurring execution' })
      );
      jest.runAllTimers(); // to handle pf4 date picker popover useTimer
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Daily', { selector: 'button' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Cronline'));
    });
    const newCronline = '1 2';
    const cronline = screen.getByLabelText('cronline');
    expect(cronline.value).toBe('');
    await act(async () => {
      fireEvent.change(cronline, {
        target: { value: newCronline },
      });
    });
    expect(cronline.value).toBe(newCronline);
    expect(screen.getByText('Review details').disabled).toBeFalsy();

    await act(async () => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    expect(screen.getAllByText('Category and Template')).toHaveLength(3);

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Recurring execution' })
      );
      jest.runAllTimers();
    });
    expect(screen.queryAllByText('Recurring execution')).toHaveLength(3);
    expect(cronline.value).toBe(newCronline);

    fireEvent.click(screen.getByText('Cronline'));
    await act(async () => {
      fireEvent.click(screen.getByText('Monthly'));
    });

    expect(screen.getByText('Review details').disabled).toBeTruthy();
    const newDays = '1,2,3';
    const days = screen.getByLabelText('days');
    expect(days.value).toBe('');
    await act(async () => {
      fireEvent.change(days, {
        target: { value: newDays },
      });
    });
    expect(days.value).toBe(newDays);

    expect(screen.getByText('Review details').disabled).toBeTruthy();
    const newAtMonthly = '13:07';
    const at = () => screen.getByLabelText('repeat-at');
    expect(at().value).toBe('');
    await act(async () => {
      fireEvent.change(at(), {
        target: { value: newAtMonthly },
      });
    });
    expect(at().value).toBe(newAtMonthly);

    expect(screen.getByText('Review details').disabled).toBeFalsy();
    fireEvent.click(screen.getByText('Monthly'));
    await act(async () => {
      fireEvent.click(screen.getByText('Weekly'));
    });

    expect(screen.getByText('Review details').disabled).toBeTruthy();
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

    expect(screen.getByText('Review details').disabled).toBeFalsy();
    fireEvent.click(screen.getByText('Weekly'));
    act(() => {
      fireEvent.click(screen.getByText('Daily'));
    });

    expect(screen.getByText('Review details').disabled).toBeFalsy();
    act(() => {
      fireEvent.change(at(), {
        target: { value: '' },
      });
    });
    expect(screen.getByText('Review details').disabled).toBeTruthy();
    const newAtDaily = '17:07';
    expect(at().value).toBe('');
    act(() => {
      fireEvent.change(at(), {
        target: { value: newAtDaily },
      });
    });
    expect(at().value).toBe(newAtDaily);
    expect(screen.getByText('Review details').disabled).toBeFalsy();

    fireEvent.click(screen.getByText('Daily'));
    act(() => {
      fireEvent.click(screen.getByText('Hourly'));
    });

    expect(screen.getByText('Review details').disabled).toBeFalsy();
    const newMinutes = '6';
    const atHourly = () => screen.getByLabelText('repeat-at-minute-typeahead');
    expect(atHourly().value).toBe('0');
    act(() => {
      fireEvent.change(atHourly(), {
        target: { value: '62' },
      });
    });
    await act(async () => {
      await fireEvent.click(screen.getByText('Create "62"'));
    });
    expect(atHourly().value).toBe('0');
    expect(
      screen.queryAllByText('Minute can only be a number between 0-59')
    ).toHaveLength(1);

    act(() => {
      fireEvent.change(atHourly(), {
        target: { value: newMinutes },
      });
    });
    await act(async () => {
      await fireEvent.click(screen.getByText(`Create "${newMinutes}"`));
    });
    expect(
      screen.queryAllByText('Minute can only be a number between 0-59')
    ).toHaveLength(0);
    expect(screen.getByText('Review details').disabled).toBeFalsy();
    expect(atHourly().value).toBe(newMinutes);
  });
});
