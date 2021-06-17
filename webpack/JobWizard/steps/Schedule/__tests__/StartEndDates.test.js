import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { StartEndDates } from '../StartEndDates';

const setEnds = jest.fn();
const props = {
  starts: '',
  setStarts: jest.fn(),
  ends: 'some-end-date',
  setEnds,
};

describe('StartEndDates', () => {
  it('never ends', () => {
    render(<StartEndDates {...props} />);
    const neverEnds = screen.getByLabelText('Never ends', {
      selector: 'input',
    });
    fireEvent.click(neverEnds);
    expect(setEnds).toBeCalledWith('');
  });
});
