import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen, render, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import { testSetup, mockApi, qglMock } from '../../../__tests__/fixtures';
import { WIZARD_TITLES } from '../../../JobWizardConstants';

const store = testSetup(selectors, api);
mockApi(api);

describe('TemplateInputs', () => {
  it('should save data between steps for template input fields', async () => {
    render(
      <MockedProvider mocks={qglMock} addTypename={false}>
        <Provider store={store}>
          <JobWizard />
        </Provider>
      </MockedProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.hostsAndInputs));
    });
    const textValue = 'I am a plain text';
    const textField = screen.getByLabelText('plain hidden', {
      selector: 'textarea',
    });

    await act(async () => {
      await fireEvent.change(textField, {
        target: { value: textValue },
      });
    });
    expect(
      screen.getByLabelText('plain hidden', {
        selector: 'textarea',
      }).value
    ).toBe(textValue);
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.categoryAndTemplate));
    });
    expect(screen.getAllByText(WIZARD_TITLES.categoryAndTemplate)).toHaveLength(
      3
    );

    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.hostsAndInputs));
    });
    expect(textField.value).toBe(textValue);
  });
});
