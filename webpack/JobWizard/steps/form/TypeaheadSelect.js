import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  MenuToggle,
  Select,
  SelectGroup,
  SelectList,
  SelectOption,
  Spinner,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Divider,
} from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

let typeaheadIds = 0;

const optionText = option =>
  option?.label === undefined || option?.label === null
    ? ''
    : String(option.label);

export const TypeaheadSelect = ({
  id,
  ouiaId,
  className,
  isMulti,
  options,
  groups,
  selected,
  onSelect,
  onInputChange,
  onClear,
  isLoading,
  isCreatable,
  createText,
  onCreateOption,
  toggleAriaLabel,
  typeAheadAriaLabel,
  placeholder,
  isDisabled,
  validated,
  maxMenuHeight,
  width,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [inputId] = useState(() => {
    typeaheadIds += 1;
    return `typeahead-input-${typeaheadIds}`;
  });

  const flatOptions = groups
    ? groups.reduce((all, group) => all.concat(group.options), [])
    : options;
  const selectedValues = []
    .concat(selected)
    .filter(value => value !== undefined && value !== null && value !== '');
  const selectedOption = isMulti
    ? undefined
    : flatOptions.find(option => option.value === selected);
  let inputValue = filterValue;
  if (!isMulti && !isFiltering) {
    inputValue = optionText(selectedOption);
  }

  const showClear =
    Boolean(filterValue) ||
    (!isMulti && typeof onClear === 'function' && selectedValues.length > 0);
  const showCreate =
    isCreatable &&
    filterValue &&
    !flatOptions.some(option => optionText(option) === filterValue);

  const handleInputChange = (_event, value) => {
    setFilterValue(value);
    setIsFiltering(true);
    setIsOpen(true);
    onInputChange(value);
  };

  const handleClear = event => {
    event.stopPropagation();
    setFilterValue('');
    setIsFiltering(false);
    if (onClear) {
      onClear();
    }
  };

  const handleSelect = (_event, value) => {
    if (value === '__create__') {
      onCreateOption(filterValue);
      setFilterValue('');
      setIsFiltering(false);
      setIsOpen(false);
      return;
    }
    const option = flatOptions.find(item => item.value === value);
    if (!option || option.isDisabled) {
      return;
    }
    onSelect(value);
    if (!isMulti) {
      setFilterValue('');
      setIsFiltering(false);
      setIsOpen(false);
    }
  };

  const renderOption = option => (
    <SelectOption
      key={option.key ?? option.value}
      value={option.value}
      description={option.description}
      isDisabled={option.isDisabled}
    >
      {option.label}
    </SelectOption>
  );

  const menu = groups ? (
    groups.map((group, index) => (
      <React.Fragment key={group.label || index}>
        {index > 0 && <Divider />}
        <SelectGroup label={group.label}>
          <SelectList>{group.options.map(renderOption)}</SelectList>
        </SelectGroup>
      </React.Fragment>
    ))
  ) : (
    <SelectList>
      {showCreate && (
        <SelectOption value="__create__">{`${createText} "${filterValue}"`}</SelectOption>
      )}
      {options.map(renderOption)}
    </SelectList>
  );

  return (
    <Select
      id={id}
      ouiaId={`${ouiaId || inputId}-menu`}
      variant="typeahead"
      isOpen={isOpen}
      selected={isMulti ? selectedValues : selected}
      onSelect={handleSelect}
      onOpenChange={nextOpen => setIsOpen(nextOpen)}
      shouldFocusToggleOnSelect
      maxMenuHeight={maxMenuHeight}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          ouiaId={ouiaId}
          className={className}
          variant="typeahead"
          status={validated === 'error' ? 'danger' : undefined}
          isDisabled={isDisabled}
          isExpanded={isOpen}
          isFullWidth={!width}
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={toggleAriaLabel}
          style={width ? { width } : undefined}
        >
          <TextInputGroup isPlain>
            <TextInputGroupMain
              id={inputId}
              value={inputValue}
              onClick={() => setIsOpen(true)}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder={placeholder}
              role="combobox"
              isExpanded={isOpen}
              aria-controls={`${inputId}-listbox`}
              aria-label={typeAheadAriaLabel}
            />
            <TextInputGroupUtilities>
              {isLoading && <Spinner size="sm" aria-label={__('Loading')} />}
              {showClear && (
                <Button
                  ouiaId={`${ouiaId || inputId}-clear`}
                  variant="plain"
                  onClick={handleClear}
                  aria-label={__('Clear input')}
                  icon={<CloseIcon />}
                />
              )}
            </TextInputGroupUtilities>
          </TextInputGroup>
        </MenuToggle>
      )}
    >
      {menu}
    </Select>
  );
};

TypeaheadSelect.propTypes = {
  id: PropTypes.string,
  ouiaId: PropTypes.string,
  className: PropTypes.string,
  isMulti: PropTypes.bool,
  options: PropTypes.array,
  groups: PropTypes.array,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  onSelect: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
  onClear: PropTypes.func,
  isLoading: PropTypes.bool,
  isCreatable: PropTypes.bool,
  createText: PropTypes.string,
  onCreateOption: PropTypes.func,
  toggleAriaLabel: PropTypes.string,
  typeAheadAriaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  validated: PropTypes.string,
  maxMenuHeight: PropTypes.string,
  width: PropTypes.number,
};

TypeaheadSelect.defaultProps = {
  id: undefined,
  ouiaId: undefined,
  className: undefined,
  isMulti: false,
  options: [],
  groups: null,
  selected: undefined,
  onInputChange: () => {},
  onClear: undefined,
  isLoading: false,
  isCreatable: false,
  createText: '',
  onCreateOption: () => {},
  toggleAriaLabel: undefined,
  typeAheadAriaLabel: undefined,
  placeholder: '',
  isDisabled: false,
  validated: undefined,
  maxMenuHeight: undefined,
  width: undefined,
};
