import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../JobWizard';
import * as selectors from '../JobWizardSelectors';
import { testSetup, mockApi, jobTemplateResponse, qglMock } from './fixtures';
import { WIZARD_TITLES } from '../JobWizardConstants';

const store = testSetup(selectors, api);

mockApi(api);
const templateInputs = [...jobTemplateResponse.template_inputs];
const advancedTemplateInputs = [
  ...jobTemplateResponse.advanced_template_inputs,
];
templateInputs[0].default = null;
advancedTemplateInputs[0].default = null;
selectors.selectTemplateInputs.mockImplementation(() => templateInputs);
selectors.selectAdvancedTemplateInputs.mockImplementation(
  () => advancedTemplateInputs
);

describe('Job wizard validation', () => {
  afterAll(() => {
    selectors.selectTemplateInputs.mockRestore();
    selectors.selectAdvancedTemplateInputs.mockRestore();
  });
  it('requeried', async () => {
    render(
      <MockedProvider mocks={qglMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    expect(screen.getByText(WIZARD_TITLES.advanced)).toBeDisabled();
    expect(screen.getByText(WIZARD_TITLES.schedule)).toBeDisabled();
    expect(screen.getByText(WIZARD_TITLES.review)).toBeDisabled();
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.hostsAndInputs));
    });
    const textField = screen.getByLabelText('plain hidden', {
      selector: 'textarea',
    });
    await act(async () => {
      await fireEvent.change(textField, {
        target: { value: 'text' },
      });
    });
    expect(screen.getByText(WIZARD_TITLES.advanced)).toBeEnabled();
    expect(screen.getByText(WIZARD_TITLES.schedule)).toBeDisabled();
    expect(screen.getByText(WIZARD_TITLES.review)).toBeDisabled();

    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
    });
    const advTextField = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    await act(async () => {
      await fireEvent.change(advTextField, {
        target: { value: 'text' },
      });
    });

    expect(
      screen.getByText(WIZARD_TITLES.advanced, { selector: 'button' })
    ).toBeEnabled();
    expect(screen.getByText(WIZARD_TITLES.schedule)).toBeEnabled();
    expect(screen.getByText(WIZARD_TITLES.review)).toBeEnabled();
  });

  it('advanced number', async () => {
    render(
      <MockedProvider mocks={qglMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );

    // setup
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.hostsAndInputs));
    });
    await act(async () => {
      await fireEvent.change(
        screen.getByLabelText('plain hidden', {
          selector: 'textarea',
        }),
        {
          target: { value: 'text' },
        }
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
    });
    await act(async () => {
      await fireEvent.change(
        screen.getByLabelText('adv plain hidden', {
          selector: 'textarea',
        }),
        {
          target: { value: 'text' },
        }
      );
    });
    expect(
      screen.getByText(WIZARD_TITLES.advanced, { selector: 'button' })
    ).toBeEnabled();
    expect(screen.getByText(WIZARD_TITLES.schedule)).toBeEnabled();
    expect(screen.getByText(WIZARD_TITLES.review)).toBeEnabled();

    // test
    const timeoutField = screen.getByLabelText('timeout to kill', {
      selector: 'input',
    });
    await act(async () => {
      await fireEvent.change(timeoutField, {
        target: { value: 'text' },
      });
    });

    expect(screen.getByText(WIZARD_TITLES.schedule)).toBeDisabled();
    expect(screen.getByText(WIZARD_TITLES.review)).toBeDisabled();

    await act(async () => {
      await fireEvent.change(timeoutField, {
        target: { value: 123 },
      });
    });

    expect(screen.getByText(WIZARD_TITLES.schedule)).toBeEnabled();
    expect(screen.getByText(WIZARD_TITLES.review)).toBeEnabled();
  });
});
