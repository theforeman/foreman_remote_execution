import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Wizard } from '@patternfly/react-core/deprecated';
import configureMockStore from 'redux-mock-store';
import { Footer } from '../Footer';
import { WIZARD_TITLES } from '../JobWizardConstants';

const store = configureMockStore([])({ API: {} });

const renderFooterWizard = ({ canSubmit = true, startAtStep = 1 } = {}) =>
  render(
    <Provider store={store}>
      <Wizard
        steps={[
          {
            name: WIZARD_TITLES.categoryAndTemplate,
            component: <div>category step</div>,
          },
          {
            name: WIZARD_TITLES.review,
            component: <div>review step</div>,
          },
        ]}
        startAtStep={startAtStep}
        footer={<Footer canSubmit={canSubmit} onSave={jest.fn()} />}
      />
    </Provider>
  );

describe('Job wizard footer', () => {
  it('enables Skip to review when required fields are filled', () => {
    renderFooterWizard({ canSubmit: true });

    expect(screen.getByText('Skip to review')).not.toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('disables Skip to review when required fields are missing', () => {
    renderFooterWizard({ canSubmit: false });

    expect(screen.getByText('Skip to review')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('disables Skip to review on the review step', async () => {
    renderFooterWizard({ canSubmit: true });

    await act(async () => {
      fireEvent.click(screen.getByText('Skip to review'));
    });

    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Skip to review')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});
