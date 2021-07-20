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
      jest.runAllTimers(); // to handle pf4 date picket popover useTimer
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
});
