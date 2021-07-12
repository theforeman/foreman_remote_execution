import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen, render, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../JobWizard';
import * as selectors from '../../JobWizardSelectors';
import { testSetup, mockApi } from '../../__tests__/fixtures';

const store = testSetup(selectors, api);
mockApi(api);
jest.spyOn(selectors, 'selectCategoryError');
jest.spyOn(selectors, 'selectAllTemplatesError');
jest.spyOn(selectors, 'selectTemplateError');

describe('Category And Template', () => {
  it('should select ', async () => {
    selectors.selectCategoryError.mockImplementation(() => null);
    selectors.selectAllTemplatesError.mockImplementation(() => null);
    selectors.selectTemplateError.mockImplementation(() => null);
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );

    expect(screen.queryAllByLabelText('Error')).toHaveLength(0);
    expect(screen.queryAllByLabelText('failed')).toHaveLength(0);
    // Category
    fireEvent.click(
      screen.getByLabelText('Ansible Commands', { selector: 'button' })
    );
    await act(async () => {
      await fireEvent.click(screen.getByText('Puppet'));
    });
    fireEvent.click(screen.getAllByText('Category and Template')[0]); // to remove focus
    expect(
      screen.queryAllByLabelText('Ansible Commands', { selector: 'button' })
    ).toHaveLength(0);
    expect(
      screen.queryAllByLabelText('Puppet', { selector: 'button' })
    ).toHaveLength(1);

    // Template
    fireEvent.click(
      screen.getByDisplayValue('template1', { selector: 'button' })
    );
    await act(async () => {
      await fireEvent.click(screen.getByText('template2'));
    });
    fireEvent.click(screen.getAllByText('Category and Template')[0]); // to remove focus
    expect(
      screen.queryAllByDisplayValue('template1', { selector: 'button' })
    ).toHaveLength(0);
    expect(
      screen.queryAllByDisplayValue('template2', { selector: 'button' })
    ).toHaveLength(1);
  });
  it('category error ', async () => {
    selectors.selectCategoryError.mockImplementation(() => 'category error');
    selectors.selectAllTemplatesError.mockImplementation(() => null);
    selectors.selectTemplateError.mockImplementation(() => null);
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );

    expect(
      screen.queryAllByText('Categories list failed with:', { exact: false })
    ).toHaveLength(1);

    expect(
      screen.queryAllByText('Templates list failed with:', { exact: false })
    ).toHaveLength(0);
    expect(
      screen.queryAllByText('Template failed with:', { exact: false })
    ).toHaveLength(0);
  });
  it('templates error ', async () => {
    selectors.selectCategoryError.mockImplementation(() => null);
    selectors.selectAllTemplatesError.mockImplementation(
      () => 'templates error'
    );
    selectors.selectTemplateError.mockImplementation(() => null);
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );

    expect(
      screen.queryAllByText('Categories list failed with:', { exact: false })
    ).toHaveLength(0);

    expect(
      screen.queryAllByText('Templates list failed with:', { exact: false })
    ).toHaveLength(1);
    expect(
      screen.queryAllByText('Template failed with:', { exact: false })
    ).toHaveLength(0);
  });
  it('template error ', async () => {
    selectors.selectCategoryError.mockImplementation(() => null);
    selectors.selectAllTemplatesError.mockImplementation(() => null);
    selectors.selectTemplateError.mockImplementation(() => 'template error');
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );

    expect(
      screen.queryAllByText('Categories list failed with:', { exact: false })
    ).toHaveLength(0);

    expect(
      screen.queryAllByText('Templates list failed with:', { exact: false })
    ).toHaveLength(0);
    expect(
      screen.queryAllByText('Template failed with:', { exact: false })
    ).toHaveLength(1);
  });
});
