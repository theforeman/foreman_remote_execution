import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { OpenAlInvocations, PopupAlert } from '../OpenAlInvocations';
import { templateInvocationPageUrl } from '../JobInvocationConstants';

// Mock the templateInvocationPageUrl function
jest.mock('../JobInvocationConstants', () => ({
  ...jest.requireActual('../JobInvocationConstants'),
  templateInvocationPageUrl: jest.fn((resultId, id) => `url/${resultId}/${id}`),
}));

describe('OpenAlInvocations', () => {
  const originalOpen = window.open;
  const mockResults = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const mockSetShowAlert = jest.fn();

  beforeAll(() => {
    const mockedOpen = jest.fn();
    window.open = mockedOpen;
  });
  afterAll(() => {
    window.open = originalOpen;
  });

  test('renders without crashing', () => {
    render(
      <OpenAlInvocations
        results={mockResults}
        id="test-id"
        setShowAlert={mockSetShowAlert}
      />
    );
  });

  test('opens links when results length is less than or equal to 3', () => {
    render(
      <OpenAlInvocations
        results={mockResults}
        id="test-id"
        setShowAlert={mockSetShowAlert}
      />
    );

    const button = screen.getByLabelText(
      'Open template invocation in a new tab',
      { selector: 'button' }
    );

    fireEvent.click(button);

    expect(templateInvocationPageUrl).toHaveBeenCalledTimes(mockResults.length);
    mockResults.forEach(result => {
      expect(templateInvocationPageUrl).toHaveBeenCalledWith(
        result.id,
        'test-id'
      );
    });
  });

  test('shows modal when results length is greater than 3', () => {
    const largeResults = [...mockResults, { id: 4 }];
    render(
      <OpenAlInvocations
        results={largeResults}
        id="test-id"
        setShowAlert={mockSetShowAlert}
      />
    );

    const button = screen.getByLabelText(
      'Open template invocation in a new tab',
      { selector: 'button' }
    );

    fireEvent.click(button);

    expect(
      screen.getByText('Open all invocations in new tabs')
    ).toBeInTheDocument();
  });

  test('shows alert when popups are blocked', () => {
    render(
      <OpenAlInvocations
        results={mockResults}
        id="test-id"
        setShowAlert={mockSetShowAlert}
      />
    );

    const button = screen.getByLabelText(
      'Open template invocation in a new tab',
      { selector: 'button' }
    );

    fireEvent.click(button);

    expect(mockSetShowAlert).toHaveBeenCalledWith(true);
  });
});

describe('PopupAlert', () => {
  const mockSetShowAlert = jest.fn();

  test('renders without crashing', () => {
    render(<PopupAlert setShowAlert={mockSetShowAlert} />);
  });

  test('closes alert when close button is clicked', () => {
    render(<PopupAlert setShowAlert={mockSetShowAlert} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetShowAlert).toHaveBeenCalledWith(false);
  });
});
