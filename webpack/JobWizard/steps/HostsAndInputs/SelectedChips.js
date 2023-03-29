import React from 'react';
import PropTypes from 'prop-types';
import { Chip, ChipGroup, Button } from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { hostMethods } from '../../JobWizardConstants';

const SelectedChip = ({ selected, setSelected, categoryName }) => {
  const deleteItem = itemToRemove => {
    setSelected(oldSelected =>
      oldSelected.filter(({ id }) => id !== itemToRemove)
    );
  };
  const NUM_CHIPS = 3;
  return (
    <>
      <ChipGroup
        className="hosts-chip-group"
        categoryName={categoryName}
        isClosable
        closeBtnAriaLabel="Remove all"
        collapsedText={sprintf(__('%s more'), selected.length - NUM_CHIPS)}
        numChips={NUM_CHIPS}
        onClick={() => {
          setSelected(() => []);
        }}
      >
        {selected.map(({ name, id }, index) => (
          <Chip
            key={index}
            id={`${categoryName}-${id}`}
            onClick={() => deleteItem(id)}
            closeBtnAriaLabel={`Remove ${name}`}
          >
            {name}
          </Chip>
        ))}
      </ChipGroup>
      {selected.length > 0 && <br />}
    </>
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
        selected={
          hostsSearchQuery
            ? [{ id: hostsSearchQuery, name: hostsSearchQuery }]
            : []
        }
        categoryName={hostMethods.searchQuery}
        setSelected={clearSearch}
      />
      {showClear && (
        <Button variant="link" className="clear-chips" onClick={clearAll}>
          {__('Clear all filters')}
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
