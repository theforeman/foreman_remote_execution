import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { fireEvent, screen, render, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import { jobTemplateResponse as jobTemplate } from '../../../__tests__/fixtures';

jest.spyOn(api, 'get');
jest.spyOn(selectors, 'selectJobTemplate');

const jobCategories = ['Ansible Commands', 'Puppet', 'Services'];
const selectedHosts = ['host1', 'host2', 'host3'];
const setSelectedHosts = jest.fn();
const props = {
  selectedHosts,
  setSelectedHosts,
  selectedHostCollections: [],
  setSelectedHostCollections: jest.fn(),
  selectedHostGroups: [],
  setSelectedHostGroups: jest.fn(),
  hostsSearchQuery: '',
  clearSearch: jest.fn(),
};


api.get.mockImplementation(({ handleSuccess, ...action }) => {
  if (action.key === 'JOB_CATEGORIES') {
    handleSuccess && handleSuccess({ data: { job_categories: jobCategories } });
  } else if (action.key === 'JOB_TEMPLATE') {
    handleSuccess &&
      handleSuccess({
        data: jobTemplate,
      });
  } else if (action.key === 'JOB_TEMPLATES') {
    handleSuccess &&
      handleSuccess({
        data: { results: [jobTemplate.job_template] },
      });
  }
  return { type: 'get', ...action };
});

const mockStore = configureMockStore([]);
const store = mockStore({});

describe('TemplateInputs', () => {
  it('should save data between steps for template input fields', async () => {
    render(
      <Provider store={store}>
        <JobWizard advancedValues={{}} setAdvancedValues={jest.fn()} />
      </Provider>
    );
    // setup
    selectors.selectJobTemplate.mockImplementation(() => jobTemplate);
    await act(async () => {
      await fireEvent.click(
        screen.getByText('Target hosts and inputs', { selector: 'button' })
      );
    });

    // test
    expect(
      screen.getAllByLabelText('host2', { selector: 'button' })
    ).toHaveLength(1);
    const chip1 = screen.getByLabelText('host1', { selector: 'button' });
    fireEvent.click(chip1);
    expect(
      screen.queryAllByLabelText('host1', { selector: 'button' })
    ).toHaveLength(0);
    expect(
      screen.queryAllByLabelText('host2', { selector: 'button' })
    ).toHaveLength(1);
  });
});
