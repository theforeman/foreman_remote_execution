import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import * as APIHooks from 'foremanReact/common/hooks/API/APIHooks';
import * as api from 'foremanReact/redux/API';
import JobWizardPageRerun from '../JobWizardPageRerun';
import * as selectors from '../JobWizardSelectors';
import { testSetup, mockApi, gqlMock, jobInvocation } from './fixtures';

const store = testSetup(selectors, api);
mockApi(api);
jest.spyOn(APIHooks, 'useAPI');
APIHooks.useAPI.mockImplementation((action, url) => {
  if (url === '/ui_job_wizard/job_invocation?id=57') {
    return { response: jobInvocation, status: 'RESOLVED' };
  }
  return {};
});

describe('Job wizard fill', () => {
  it('fill defaults into fields', async () => {
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
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });
    await screen.findByLabelText('plain hidden', {
      selector: 'textarea',
    });

    expect(
      screen.getByLabelText('plain hidden', {
        selector: 'textarea',
      }).value
    ).toBe('test command');

    await act(async () => {
      fireEvent.click(screen.getByText('Advanced fields'));
    });

    expect(
      screen.getByLabelText('ssh user', {
        selector: 'input',
      }).value
    ).toBe('ssh user');
    expect(
      screen.getByLabelText('effective user', {
        selector: 'input',
      }).value
    ).toBe('Effective user');
    expect(
      screen.getByLabelText('timeout to kill', {
        selector: 'input',
      }).value
    ).toBe('1');

    expect(
      screen.getByLabelText('Concurrency level', {
        selector: 'input',
      }).value
    ).toBe('6');
    expect(
      screen.getByLabelText('Time span', {
        selector: 'input',
      }).value
    ).toBe('4');
  });
});
