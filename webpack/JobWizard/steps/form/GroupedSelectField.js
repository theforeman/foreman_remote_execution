import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  SelectOption,
  Select,
  SelectGroup,
  SelectVariant,
  FormGroup,
} from '@patternfly/react-core';

export const GroupedSelectField = ({
  label,
  fieldId,
  groups,
  selected,
  setSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onSelect = selection => {
    setIsOpen(false);
    setSelected(selection);
  };

  const onClear = () => {
    onSelect(null);
  };

  const options = groups.map((group, groupIndex) => (
    <SelectGroup key={groupIndex} label={group.groupLabel}>
      {group.options.map((option, optionIndex) => (
        <SelectOption
          key={optionIndex}
          value={option.label}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </SelectGroup>
  ));

  const onFilter = evt => {
    const textInput = evt?.target?.value || '';
    if (textInput === '') {
      return options;
    }
    return options
      .map(group => {
        const filteredGroup = React.cloneElement(group, {
          children: group.props.children.filter(item =>
            item.props.value.toLowerCase().includes(textInput.toLowerCase())
          ),
        });
        if (filteredGroup.props.children.length > 0) return filteredGroup;
        return null;
      })
      .filter(newGroup => newGroup);
  };

  return (
    <FormGroup label={label} fieldId={fieldId}>
      <Select
        isGrouped
        variant={SelectVariant.typeahead}
        onToggle={setIsOpen}
        onFilter={onFilter}
        isOpen={isOpen}
        onSelect={() => null}
        selections={selected}
        className="without_select2"
        onClear={onClear}
      >
        {options}
      </Select>
    </FormGroup>
  );
};

GroupedSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  groups: PropTypes.array,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelected: PropTypes.func.isRequired,
};

GroupedSelectField.defaultProps = {
  groups: [],
  selected: null,
};
