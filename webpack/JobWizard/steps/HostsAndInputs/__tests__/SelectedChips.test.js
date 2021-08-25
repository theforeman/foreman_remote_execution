import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen, render, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import { testSetup, mockApi } from '../../../__tests__/fixtures';

const store = testSetup(selectors, api);
mockApi(api);

describe('TemplateInputs', () => {
  it('should save data between steps for template input fields', async () => {
    render(
      <Provider store={store}>
        <JobWizard advancedValues={{}} setAdvancedValues={jest.fn()} />
      </Provider>
    );
    await act(async () => {
      await fireEvent.click(
        screen.getByText('Target hosts and inputs', { selector: 'button' })
      );
    });

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
