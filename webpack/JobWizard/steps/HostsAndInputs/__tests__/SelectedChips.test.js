import React from 'react';
import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { render, fireEvent, screen } from '@testing-library/react';
import * as patternfly from '@patternfly/react-core';
import { SelectedChips } from '../SelectedChips';

jest.spyOn(patternfly, 'Chip');
jest.spyOn(patternfly, 'ChipGroup');
patternfly.Chip.mockImplementation(props => <div {...props} />);
patternfly.ChipGroup.mockImplementation(props => <div {...props} />);

const selectedHosts = ['host1', 'host2', 'host3'];
const setSelectedHosts = jest.fn();
const props = {
  selected: [selectedHosts[0]],
  setSelected: setSelectedHosts,
};
const fixtures = {
  'renders with props': props,
};

describe('SelectedChips', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(SelectedChips, fixtures));
  it('deleting', () => {
    patternfly.Chip.mockRestore();
    patternfly.ChipGroup.mockRestore();
    render(<SelectedChips {...props} />);
    const chip1 = screen.getByLabelText('host1', { selector: 'button' });
    fireEvent.click(chip1);
    expect(setSelectedHosts).toBeCalled();
  });
});
