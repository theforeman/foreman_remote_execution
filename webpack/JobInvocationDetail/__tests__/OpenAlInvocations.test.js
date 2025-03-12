import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { OpenAllInvocations, PopupAlert } from '../OpenAllInvocations';
import { templateInvocationPageUrl } from '../JobInvocationConstants';

// Mock the templateInvocationPageUrl function
jest.mock('../JobInvocationConstants', () => ({
  ...jest.requireActual('../JobInvocationConstants'),
  templateInvocationPageUrl: jest.fn((resultId, id) => `url/${resultId}/${id}`),
}));

describe('OpenAllInvocations', () => {
  const mockResults = [1, 2, 3];
  const mockSetShowAlert = jest.fn();
  let windowSpy;
  const windowOpen = window.open;

  beforeAll(() => {
    window.open = () => {};
  });
  afterAll(() => {
    windowSpy.mockRestore();
    jest.clearAllMocks();
    window.open = windowOpen;
  });

  test('renders without crashing', () => {
    render(
      <OpenAllInvocations
        allHostsIds={mockResults}
        bulkParams="id ^ (1,2,3)"
        id="test-id"
        isAllSelected={false}
        setShowAlert={mockSetShowAlert}
      />
    );
  });

  test('opens links when results length is less than or equal to 3', () => {
    render(
      <OpenAllInvocations
        allHostsIds={mockResults}
        bulkParams="id ^ (1,2,3)"
        id="test-id"
        isAllSelected={false}
        setShowAlert={mockSetShowAlert}
      />
    );

    const button = screen.getByRole('button', { name: /open all/i });
    fireEvent.click(button);

    expect(templateInvocationPageUrl).toHaveBeenCalledTimes(mockResults.length);
    mockResults.forEach(result => {
      expect(templateInvocationPageUrl).toHaveBeenCalledWith(
        result.toString(),
        'test-id'
      );
    });
  });

  test('shows modal when results length is greater than 3', () => {
    const largeResults = [...mockResults, 4];
    render(
      <OpenAllInvocations
        allHostsIds={largeResults}
        bulkParams="id ^ (1,2,3,4)"
        id="test-id"
        isAllSelected={false}
        setShowAlert={mockSetShowAlert}
      />
    );

    const button = screen.getByRole('button', { name: /open all/i });
    fireEvent.click(button);

    expect(
      screen.getAllByText(/open all selected invocations in new tabs/i)
    ).toHaveLength(2);
  });

  test('shows alert when popups are blocked', () => {
    window.open = jest.fn().mockReturnValueOnce(null);

    render(
      <OpenAllInvocations
        allHostsIds={mockResults}
        bulkParams="id ^ (1,2,3)"
        id="test-id"
        isAllSelected={false}
        setShowAlert={mockSetShowAlert}
      />
    );

    const button = screen.getByRole('button', { name: /open all/i });
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
