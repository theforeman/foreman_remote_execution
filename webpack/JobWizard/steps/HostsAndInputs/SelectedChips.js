import React from 'react';
import PropTypes from 'prop-types';
import { Chip, ChipGroup, Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { hostMethods } from '../../JobWizardConstants';

const SelectedChip = ({ selected, setSelected, categoryName }) => {
  const deleteItem = itemToRemove => {
    setSelected(oldSelected =>
      oldSelected.filter(item => item !== itemToRemove)
    );
  };
  return (
    <ChipGroup className="hosts-chip-group" categoryName={categoryName}>
      {selected.map(chip => (
        <Chip
          key={chip}
          id={chip}
          onClick={() => deleteItem(chip)}
          closeBtnAriaLabel={`Close ${chip}`}
        >
          {chip}
        </Chip>
      ))}
    </ChipGroup>
  );
};

export const SelectedChips = ({
  selectedHosts,
  setSelectedHosts,
  selectedHostCollections,
  setSelectedHostCollections,
  selectedHostGroups,
  setSelectedHostGroups,
  hostsSearchQuery,
  clearSearch,
}) => {
  const clearAll = () => {
    setSelectedHosts(() => []);
    setSelectedHostCollections(() => []);
    setSelectedHostGroups(() => []);
    clearSearch();
  };
  const showClear =
    selectedHosts.length ||
    selectedHostCollections.length ||
    selectedHostGroups.length ||
    hostsSearchQuery;
  return (
    <div className="selected-chips">
      <SelectedChip
        selected={selectedHosts}
        categoryName={hostMethods.hosts}
        setSelected={setSelectedHosts}
      />
      <SelectedChip
        selected={selectedHostCollections}
        categoryName={hostMethods.hostCollections}
        setSelected={setSelectedHostCollections}
      />
      <SelectedChip
        selected={selectedHostGroups}
        categoryName={hostMethods.hostGroups}
        setSelected={setSelectedHostGroups}
      />
      <SelectedChip
        selected={hostsSearchQuery ? [hostsSearchQuery] : []}
        categoryName={hostMethods.searchQuery}
        setSelected={clearSearch}
      />
      {showClear && (
        <Button variant="link" className="clear-chips" onClick={clearAll}>
          {__('Clear filters')}
        </Button>
      )}
    </div>
  );
};

SelectedChips.propTypes = {
  selectedHosts: PropTypes.array.isRequired,
  setSelectedHosts: PropTypes.func.isRequired,
  selectedHostCollections: PropTypes.array.isRequired,
  setSelectedHostCollections: PropTypes.func.isRequired,
  selectedHostGroups: PropTypes.array.isRequired,
  setSelectedHostGroups: PropTypes.func.isRequired,
  hostsSearchQuery: PropTypes.string.isRequired,
  clearSearch: PropTypes.func.isRequired,
};

SelectedChip.propTypes = {
  categoryName: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
