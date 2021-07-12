import React from 'react';
import PropTypes from 'prop-types';
import { Chip, ChipGroup } from '@patternfly/react-core';

export const SelectedChips = ({ selected, setSelected }) => {
  const deleteItem = itemToRemove => {
    setSelected(oldSelected =>
      oldSelected.filter(item => item !== itemToRemove)
    );
  };
  return (
    <ChipGroup className="hosts-chip-group">
      {selected.map(chip => (
        <Chip key={chip} id={chip} onClick={() => deleteItem(chip)}>
          {chip}
        </Chip>
      ))}
    </ChipGroup>
  );
};

SelectedChips.propTypes = {
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
