import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { StartEndDates } from '../StartEndDates';

const setEnds = jest.fn();
const setIsNeverEnds = jest.fn();
const props = {
  starts: '',
  setStarts: jest.fn(),
  ends: 'some-end-date',
  setEnds,
  setIsNeverEnds,
  isNeverEnds: false,
};

describe('StartEndDates', () => {
  it('never ends', async () => {
    await act(async () => render(<StartEndDates {...props} />));
    const neverEnds = screen.getByRole('checkbox', { name: 'Never ends' });
    await act(async () => fireEvent.click(neverEnds));
    expect(setIsNeverEnds).toBeCalledWith(true);
  });
});
