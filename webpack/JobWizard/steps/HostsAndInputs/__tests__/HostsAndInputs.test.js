import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen, render, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import * as api from 'foremanReact/redux/API';
import * as routerSelectors from 'foremanReact/routes/RouterSelector';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import { testSetup, mockApi, gqlMock } from '../../../__tests__/fixtures';

const store = testSetup(selectors, api);
mockApi(api);
const lodash = require('lodash');

lodash.debounce = fn => fn;

describe('Hosts', () => {
  it('Host selection chips removal and keep state between steps', async () => {
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
      await new Promise(resolve => setTimeout(resolve, 0)); // to resolve gql
    });
    const select = name =>
      screen.getByRole('button', { name: `${name} toggle` });
    fireEvent.click(select('hosts'));
    await act(async () => {
      fireEvent.click(screen.getByText('host1'));
      fireEvent.click(select('hosts'));
    });
    expect(
      screen.queryAllByText('Please select at least one host')
    ).toHaveLength(0);
    await act(async () => {
      fireEvent.click(select('hosts'));
    });
    await act(async () => {
      fireEvent.click(
        screen.getByText('host1', {
          selector: '.pf-c-select__menu-item',
        })
      );
      fireEvent.blur(select('hosts'));
    });
    expect(
      screen.queryAllByText('Please select at least one host')
    ).toHaveLength(1);
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
    fireEvent.click(select('host groups'));
    await act(async () => {
      fireEvent.click(screen.getByText('host_group1'));
    });

    fireEvent.click(
      screen.getByText('Host groups', { selector: '.pf-c-select__toggle-text' })
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Host collections'));
    });
    fireEvent.click(select('host collections'));
    await act(async () => {
      fireEvent.click(screen.getByText('host_collection1'));
    });

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
    expect(screen.queryAllByText('host_collection1')).toHaveLength(1);

    await act(async () => {
      fireEvent.click(screen.getByText('Category and template'));
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
  it('Host Collection isnt shown without katello', async () => {
    selectors.selectWithKatello.mockImplementation(() => false);
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });

    expect(screen.queryAllByText('Hosts')).toHaveLength(1);
    await act(async () => {
      fireEvent.click(
        screen.getByText('Hosts', { selector: '.pf-c-select__toggle-text' })
      );
    });
    expect(screen.queryAllByText('Host groups')).toHaveLength(1);
    expect(screen.queryAllByText('Search query')).toHaveLength(1);
    expect(screen.queryAllByText('Host collections')).toHaveLength(0);
  });
  it('Host fill list from url', async () => {
    routerSelectors.selectRouterLocation.mockImplementation(() => ({
      search: '?host_ids%5B%5D=host1&host_ids%5B%5D=host3',
    }));
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });
    api.get.mock.calls.forEach(call => {
      if (call[0].key === 'HOST_IDS') {
        expect(call[0].params).toEqual({ search: 'id = host1 or id = host3' });
      }
    });

    expect(screen.queryAllByText('host1')).toHaveLength(1);
    expect(screen.queryAllByText('host2')).toHaveLength(0);
    expect(screen.queryAllByText('host3')).toHaveLength(1);
  });
  it('Host fill search from url', async () => {
    routerSelectors.selectRouterLocation.mockImplementation(() => ({
      search: 'search=os=gnome',
    }));
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });
    expect(screen.queryAllByText('os=gnome')).toHaveLength(1);
  });

  it('input fill from url', async () => {
    const inputText = 'test text';
    const advancedInputText = 'test adv text';
    routerSelectors.selectRouterLocation.mockImplementation(() => ({
      search: `host_ids%5B%5D=host1&host_ids%5B%5D=host3&feature=test_feature&inputs[plain hidden]=${inputText}&inputs[adv plain hidden]=${advancedInputText}`,
    }));
    render(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    api.get.mock.calls.forEach(call => {
      if (call[0].key === 'REX_FEATURE') {
        expect(call[0].url).toEqual(
          '/api/remote_execution_features/test_feature'
        );
      }
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });
    const textField = screen.getByLabelText('plain hidden', {
      selector: 'textarea',
    });
    expect(textField.value).toBe(inputText);

    await act(async () => {
      fireEvent.click(screen.getByText('Advanced fields'));
    });
    const advancedTextField = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    expect(advancedTextField.value).toBe(advancedInputText);
  });
});
