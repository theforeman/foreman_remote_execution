import React from 'react';
import { screen, fireEvent, render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RexInterface from '../RexInterface';

const fixtures = {
  renders: { isLoading: false, onChange: () => {} },
};

describe('RexInterface', () => {
  it('should render label with help icon and popover instructions', async () => {
    jest.useFakeTimers();
    render(<RexInterface {...fixtures.renders} />);
    await act(async () => {
      await fireEvent.click(screen.getByRole('button'));

      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Remote Execution Interface')).toBeInTheDocument();
    expect(
      screen.getByText('Identifier of the Host interface for Remote execution')
    ).toBeInTheDocument();
  });
});
