import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen, render, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import { testSetup, mockApi } from '../../../__tests__/fixtures';

const store = testSetup(selectors, api);
mockApi(api);
const lodash = require('lodash');

lodash.debounce = fn => fn;

describe('Hosts', () => {
  it('Host selection chips removal and keep state between steps', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });
    const select = () => screen.getByRole('button', { name: 'Options menu' });
    fireEvent.click(select());
    await act(async () => {
      fireEvent.click(screen.getByText('host1'));
      fireEvent.click(screen.getByText('host2'));
    });
    fireEvent.click(
      screen.getByText('Hosts', { selector: '.pf-c-select__toggle-text' })
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Host groups'));
    });
    fireEvent.click(select());
    await act(async () => {
      fireEvent.click(screen.getByText('host_group1'));
    });
    fireEvent.click(select());
    expect(screen.queryAllByText('host1')).toHaveLength(1);
    expect(screen.queryAllByText('host2')).toHaveLength(1);
    expect(screen.queryAllByText('host3')).toHaveLength(0);
    const chip1 = screen.getByRole('button', { name: 'Close host1 host1' });
    await act(async () => {
      fireEvent.click(chip1);
    });
    expect(screen.queryAllByText('host1')).toHaveLength(0);
    expect(screen.queryAllByText('host3')).toHaveLength(0);
    expect(screen.queryAllByText('host2')).toHaveLength(1);
    expect(screen.queryAllByText('host_group1')).toHaveLength(1);

    fireEvent.click(
      screen.getByText('Host groups', { selector: '.pf-c-select__toggle-text' })
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });
    expect(screen.queryAllByText('host2')).toHaveLength(1);
    expect(screen.queryAllByText('host_group1')).toHaveLength(1);

    await act(async () => {
      fireEvent.click(screen.getByText('Clear filters'));
    });

    expect(screen.queryAllByText('host2')).toHaveLength(0);
    expect(screen.queryAllByText('host_group1')).toHaveLength(0);
  });
});
