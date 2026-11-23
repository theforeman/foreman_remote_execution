import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';

export const SelectField = ({
  labelInfo,
  label,
  fieldId,
  options,
  value,
  setValue,
  labelHelp,
  isRequired,
  className,
  toggleIcon,
  toggleAriaLabel,
  placeholderText,
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectOptions = [
    !isRequired && { value: '', label: ' ' },
    ...options.map(option =>
      option !== null && typeof option === 'object'
        ? option
        : { value: option, label: option }
    ),
  ].filter(Boolean);
  const selectedOption = selectOptions.find(option => option.value === value);

  return (
    <FormGroup
      labelInfo={labelInfo}
      label={label}
      fieldId={fieldId}
      labelHelp={labelHelp}
      isRequired={isRequired}
    >
      <Select
        ouiaId={fieldId}
        isOpen={isOpen}
        selected={value}
        onSelect={(_event, selection) => {
          setValue(selection);
          setIsOpen(false);
        }}
        onOpenChange={setIsOpen}
        toggle={toggleRef => (
          <MenuToggle
            ref={toggleRef}
            ouiaId={`${fieldId}-toggle`}
            id={fieldId}
            className={className}
            isExpanded={isOpen}
            isDisabled={isDisabled}
            isFullWidth
            onClick={() => setIsOpen(prev => !prev)}
            aria-label={
              toggleAriaLabel || (label ? `${label} toggle` : undefined)
            }
            icon={toggleIcon}
          >
            {selectedOption ? selectedOption.label : placeholderText}
          </MenuToggle>
        )}
      >
        <SelectList>
          {selectOptions.map(option => (
            <SelectOption key={String(option.value)} value={option.value}>
              {option.label}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </FormGroup>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  labelInfo: PropTypes.node,
  fieldId: PropTypes.string.isRequired,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setValue: PropTypes.func.isRequired,
  labelHelp: PropTypes.node,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  toggleIcon: PropTypes.node,
  toggleAriaLabel: PropTypes.string,
  placeholderText: PropTypes.string,
  isDisabled: PropTypes.bool,
};

SelectField.defaultProps = {
  label: null,
  labelInfo: null,
  options: [],
  labelHelp: null,
  value: null,
  isRequired: false,
  className: undefined,
  toggleIcon: undefined,
  toggleAriaLabel: undefined,
  placeholderText: ' ',
  isDisabled: false,
};
