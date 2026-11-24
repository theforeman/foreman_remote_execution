import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from '@patternfly/react-core';
import { TypeaheadSelect } from './TypeaheadSelect';

export const GroupedSelectField = ({
  label,
  fieldId,
  groups,
  selected,
  setSelected,
  isDisabled,
  placeholderText,
}) => {
  const [filterValue, setFilterValue] = useState('');
  const selectedName = Array.isArray(selected) ? '' : selected || '';
  const allOptions = groups.reduce(
    (options, group) => options.concat(group.options),
    []
  );
  const selectedId = allOptions.find(option => option.label === selectedName)
    ?.value;
  const visibleGroups = groups
    .map(group => ({
      label: group.groupLabel,
      options: group.options.filter(option =>
        option.label.toLowerCase().includes(filterValue.toLowerCase())
      ),
    }))
    .filter(group => group.options.length);

  return (
    <FormGroup label={label} fieldId={fieldId}>
      <TypeaheadSelect
        ouiaId={fieldId}
        className="without_select2"
        groups={visibleGroups}
        selected={selectedId}
        isDisabled={isDisabled}
        placeholder={placeholderText}
        maxMenuHeight="45vh"
        toggleAriaLabel={`${label} toggle`}
        typeAheadAriaLabel={`${label} typeahead input`}
        onInputChange={setFilterValue}
        onSelect={selection => {
          setFilterValue('');
          setSelected(selection);
        }}
        onClear={() => {
          setFilterValue('');
          setSelected(null);
        }}
      />
    </FormGroup>
  );
};

GroupedSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  groups: PropTypes.array,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  setSelected: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  placeholderText: PropTypes.string,
};

GroupedSelectField.defaultProps = {
  groups: [],
  selected: null,
  isDisabled: false,
  placeholderText: '',
};
