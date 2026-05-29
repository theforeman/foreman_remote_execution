import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import * as api from 'foremanReact/redux/API';
import JobWizardPageRerun from '../JobWizardPageRerun';
import * as selectors from '../JobWizardSelectors';
import {
  testSetup,
  mockApi,
  gqlMock,
  jobInvocation,
  bookmarksList,
} from './fixtures';

const store = testSetup(selectors, api);
mockApi(api);

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
      screen.getByLabelText('time to pickup', {
        selector: 'input',
      }).value
    ).toBe('25');

    expect(
      screen.getByLabelText('Concurrency level', {
        selector: 'input',
      }).value
    ).toBe('6');
  });

  it('fills bookmark on rerun when job used a bookmark', async () => {
    const bookmark = bookmarksList[0];
    const jobWithBookmark = {
      ...jobInvocation,
      job: {
        ...jobInvocation.job,
        targeting: {
          ...jobInvocation.job.targeting,
          bookmark_id: bookmark.id,
          search_query: null,
        },
      },
    };

    selectors.selectRerunJobInvocationResponse.mockImplementation(
      () => jobWithBookmark
    );

    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizardPageRerun
            match={{
              params: { id: '99' },
            }}
          />
        </Provider>
      </MockedProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });

    const hostMethodSelect = screen.getByRole('button', {
      name: 'host method',
    });
    expect(hostMethodSelect.textContent).toContain('Search query');

    expect(screen.queryAllByText(bookmark.query)).toHaveLength(1);

    selectors.selectRerunJobInvocationResponse.mockImplementation(
      () => jobInvocation
    );
  });
});
