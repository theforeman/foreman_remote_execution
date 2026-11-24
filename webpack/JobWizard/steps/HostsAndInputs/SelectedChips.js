import React from 'react';
import PropTypes from 'prop-types';
import { Button, Label, LabelGroup } from '@patternfly/react-core';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { hostMethods } from '../../JobWizardConstants';

const SelectedChip = ({ selected, setSelected, categoryName, setLabel }) => {
  const deleteItem = itemToRemove => {
    setSelected(oldSelected =>
      oldSelected.filter(({ id }) => id !== itemToRemove)
    );
  };
  const NUM_CHIPS = 3;
  return (
    <>
      <LabelGroup
        ouiaId="hosts-chip-group"
        className="hosts-chip-group"
        categoryName={categoryName}
        isClosable
        closeBtnAriaLabel={__('Remove all')}
        collapsedText={sprintf(
          __('%s more'),
          Math.max(selected.length - NUM_CHIPS, 0)
        )}
        numLabels={NUM_CHIPS}
        onClick={() => {
          setSelected(() => []);
        }}
      >
        {selected.map((result, index) => (
          <Label
            variant="outline"
            ouiaId={`${categoryName}-${result.id}`}
            key={index}
            id={`${categoryName}-${result.id}`}
            onClose={() => deleteItem(result.id)}
            closeBtnAriaLabel={sprintf(__('Remove %s'), result.name)}
          >
            {setLabel(result)}
          </Label>
        ))}
      </LabelGroup>
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
  setLabel,
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
        setLabel={setLabel}
      />
      <SelectedChip
        selected={selectedHostCollections}
        categoryName={hostMethods.hostCollections}
        setSelected={setSelectedHostCollections}
        setLabel={setLabel}
      />
      <SelectedChip
        selected={selectedHostGroups}
        categoryName={hostMethods.hostGroups}
        setSelected={setSelectedHostGroups}
        setLabel={setLabel}
      />
      <SelectedChip
        selected={
          hostsSearchQuery
            ? [{ id: hostsSearchQuery, name: hostsSearchQuery }]
            : []
        }
        categoryName={hostMethods.searchQuery}
        setSelected={clearSearch}
        setLabel={setLabel}
      />
      {showClear && (
        <Button
          ouiaId="clear-chips"
          variant="link"
          className="clear-chips"
          onClick={clearAll}
        >
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
  setLabel: PropTypes.func.isRequired,
};

SelectedChip.propTypes = {
  categoryName: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  setLabel: PropTypes.func.isRequired,
};
