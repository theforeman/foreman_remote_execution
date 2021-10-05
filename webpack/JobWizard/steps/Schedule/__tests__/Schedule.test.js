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
    const [startsDateField, endsDateField] = screen.getAllByPlaceholderText(
      'yyyy/mm/dd'
    );
    const [startsTimeField, endsTimeField] = screen.getAllByPlaceholderText(
      'hh:mm'
    );
    await act(async () => {
      await fireEvent.change(startsDateField, {
        target: { value: newStartDate },
      });
      await fireEvent.change(startsTimeField, {
        target: { value: newStartTime },
      });
      await fireEvent.change(endsDateField, { target: { value: newEndsDate } });
      await fireEvent.change(endsTimeField, { target: { value: newEndsTime } });
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
    const [startsDateField] = screen.getAllByPlaceholderText('yyyy/mm/dd');
    const [startsTimeField] = screen.getAllByPlaceholderText('hh:mm');
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

    const [, endsDateField] = screen.getAllByPlaceholderText('yyyy/mm/dd');
    const [, endsTimeField] = screen.getAllByPlaceholderText('hh:mm');
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
    await act(async () => {
      fireEvent.click(
        screen.getByLabelText('Does not repeat', { selector: 'button' })
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Cronline'));
    });
    fireEvent.click(screen.getAllByText('Schedule')[0]); // to remove focus

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

    await act(async () => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    expect(screen.getAllByText('Category and Template')).toHaveLength(3);

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule'));
      jest.runAllTimers();
    });
    fireEvent.click(screen.getAllByText('Schedule')[0]); // to remove focus
    expect(screen.queryAllByText('Schedule')).toHaveLength(3);
    expect(repeatNTimes.value).toBe(newRepeatTimes);
    expect(cronline.value).toBe(newCronline);

    fireEvent.click(screen.getByText('Cronline'));
    await act(async () => {
      fireEvent.click(screen.getByText('Monthly'));
    });

    const newDays = '1,2,3';
    const days = screen.getByLabelText('days');
    expect(days.value).toBe('');
    await act(async () => {
      fireEvent.change(days, {
        target: { value: newDays },
      });
    });
    expect(days.value).toBe(newDays);

    const newAt = '13:07';
    const at = screen.getByLabelText('repeat-at');
    expect(at.value).toBe('');
    await act(async () => {
      fireEvent.change(at, {
        target: { value: newAt },
      });
    });
    expect(at.value).toBe(newAt);

    fireEvent.click(screen.getByText('Monthly'));
    await act(async () => {
      fireEvent.click(screen.getByText('Weekly'));
    });
    const dayTue = screen.getByLabelText('Tue');
    const daySat = screen.getByLabelText('Sat');
    expect(dayTue.checked).toBe(false);
    expect(daySat.checked).toBe(false);
    await act(async () => {
      fireEvent.change(dayTue, {
        target: { checked: true },
      });

      fireEvent.change(daySat, {
        target: { checked: true },
      });
    });
    expect(dayTue.checked).toBe(true);
    expect(daySat.checked).toBe(true);

    fireEvent.click(screen.getByText('Weekly'));
    await act(async () => {
      fireEvent.click(screen.getByText('Daily'));
    });

    const newAtDaily = '17:07';
    const atDaily = screen.getByLabelText('repeat-at');
    expect(atDaily.value).toBe(newAt);
    await act(async () => {
      fireEvent.change(atDaily, {
        target: { value: newAtDaily },
      });
    });
    expect(atDaily.value).toBe(newAtDaily);

    fireEvent.click(screen.getByText('Daily'));
    await act(async () => {
      fireEvent.click(screen.getByText('Hourly'));
    });

    const newMinutes = '15';
    const atHourly = screen.getByLabelText('repeat-at-minute-typeahead');
    expect(atHourly.value).toBe('');
    await act(async () => {
      fireEvent.change(atHourly, {
        target: { value: newMinutes },
      });
    });
    expect(atHourly.value).toBe(newMinutes);
  });
});
