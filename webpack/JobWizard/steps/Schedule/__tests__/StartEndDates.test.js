import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { StartEndDates } from '../StartEndDates';

const setEnds = jest.fn();
const setIsNeverEnds = jest.fn();
const setValid = jest.fn();
const props = {
  startsAt: '',
  startsBefore: '',
  setStartsAt: jest.fn(),
  setStartsBefore: jest.fn(),
  ends: 'some-end-date',
  setEnds,
  setIsNeverEnds,
  isNeverEnds: false,
  validEnd: true,
  setValidEnd: setValid,
  isFuture: false,
  isStartBeforeDisabled: false,
  isEndDisabled: false,
};

describe('StartEndDates', () => {
  it('never ends', async () => {
    await act(async () => render(<StartEndDates {...props} />));
    const neverEnds = screen.getByRole('checkbox', { name: 'Never ends' });
    await act(async () => fireEvent.click(neverEnds));
    expect(setIsNeverEnds).toBeCalledWith(true);
    expect(setValid).toBeCalledWith(true);
  });
});
