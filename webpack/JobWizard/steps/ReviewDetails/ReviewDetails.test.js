import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import * as APIHooks from 'foremanReact/common/hooks/API/APIHooks';
import * as api from 'foremanReact/redux/API';

import JobWizardPageRerun from '../../JobWizardPageRerun';
import * as selectors from '../../JobWizardSelectors';
import {
  testSetup,
  mockApi,
  gqlMock,
  jobInvocation,
} from '../../__tests__/fixtures';

jest.useFakeTimers();
const store = testSetup(selectors, api);
mockApi(api);
jest.spyOn(APIHooks, 'useAPI');
store.dispatch = jest.fn();
APIHooks.useAPI.mockImplementation((action, url) => {
  if (url === '/ui_job_wizard/job_invocation?id=57') {
    return { response: jobInvocation, status: 'RESOLVED' };
  }
  return {};
});

describe('ReviewDetails', () => {
  it('should call goToStepByName function when StepButton is clicked', async () => {
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizardPageRerun
            match={{
              params: { id: '57' },
            }}
          />
        </Provider>
      </MockedProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Type of execution'));
    });
    act(() => {
      fireEvent.click(screen.getByText('Future execution'));

      jest.advanceTimersByTime(1000); // to handle pf4 date picker popover useTimer
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Future execution' }));
      jest.advanceTimersByTime(1000); // to handle pf4 date picker popover useTimer
    });

    const newStartAtDate = '2030/03/12';
    const newStartAtTime = '14:27';
    const startsAtDateField = () =>
      screen.getByLabelText('starts at datepicker');
    const startsAtTimeField = () =>
      screen.getByLabelText('starts at timepicker');

    await act(async () => {
      await fireEvent.change(startsAtDateField(), {
        target: { value: newStartAtDate },
      });
      fireEvent.change(startsAtTimeField(), {
        target: { value: newStartAtTime },
      });
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      fireEvent.click(screen.getByText('Review details'));
    });
    expect(screen.getAllByText('Review details')).toHaveLength(3);
    fireEvent.click(
      screen.getByText('Job template', {
        selector: '.pf-v5-c-button',
      })
    );
    expect(screen.getAllByText('Category and template')).toHaveLength(3);

    await act(async () => {
      fireEvent.click(screen.getByText('Review details'));
      jest.advanceTimersByTime(1000);
    });
    act(() => {
      fireEvent.click(
        screen.getByText('Target hosts', {
          selector: '.pf-v5-c-button',
        })
      );
      jest.advanceTimersByTime(1000); // to handle pf4 date picker popover useTimer
    });
    expect(screen.getAllByText('Target hosts and inputs')).toHaveLength(3);
    act(() => {
      fireEvent.click(screen.getByText('Review details'));
    });
    act(() => {
      fireEvent.click(
        screen.getByText('Advanced fields', {
          selector: '.pf-v5-c-button',
        })
      );
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getAllByText('Advanced fields')).toHaveLength(3);

    act(() => {
      fireEvent.click(screen.getByText('Review details'));
    });
    act(() => {
      fireEvent.click(screen.getByText('Recurrence'));
    });
    expect(screen.getAllByText('Schedule')).toHaveLength(3);
  });
});
