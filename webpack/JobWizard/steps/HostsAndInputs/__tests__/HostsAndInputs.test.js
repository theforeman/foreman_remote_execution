const jobCategories = ['Ansible Commands', 'Puppet', 'Services'];
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
jest.spyOn(selectors, 'selectResponse');

selectors.selectResponse.mockImplementation((state, key) => {
  if (key === 'HOSTS') {
    return {
      results: [{ name: 'host1' }, { name: 'host2' }, { name: 'host3' }],
      subtotal: 2,
    };
  } else if (key === 'HOST_GROUPS') {
    return {
      results: [
        { name: 'host_group1' },
        { name: 'host_group2' },
        { name: 'host_group3' },
      ],
      subtotal: 2,
    };
  }
});

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
      fireEvent.click(screen.getByText('Search query'));
    });
    const searchField = screen.getByPlaceholderText('Filter...');
    await act(async () => {
      fireEvent.change(searchField, {
        target: { value: 'some search' },
      });
    });
    await act(async () => {
      fireEvent.click(
        screen.getByText('Hosts', { selector: '.pf-c-select__toggle-text' })
      );
    });

    expect(screen.getAllByPlaceholderText('Filter...')).toHaveLength(0);
    expect(screen.queryAllByText('some search')).toHaveLength(1);

    await act(async () => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Target hosts and inputs'));
    });
    expect(screen.queryAllByText('host2')).toHaveLength(1);
    expect(screen.queryAllByText('host_group1')).toHaveLength(1);

    const chipSearch = screen.getByRole('button', {
      name: 'Close some search some search',
    });
    await act(async () => {
      fireEvent.click(chipSearch);
    });

    expect(screen.queryAllByText('some search')).toHaveLength(0);
  });
});
