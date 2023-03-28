import React, { useState } from 'react';
import { FormGroup, Select, SelectOption } from '@patternfly/react-core';
import PropTypes from 'prop-types';

export const SelectField = ({
  labelInfo,
  label,
  fieldId,
  options,
  value,
  setValue,
  labelIcon,
  isRequired,
  ...props
}) => {
  const onSelect = (event, selection) => {
    setValue(selection);
    setIsOpen(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const selectOptions = [
    !isRequired && (
      <SelectOption key={0} value="">
        <p> </p>
      </SelectOption>
    ),
    ...options.map((option, index) => (
      <SelectOption key={index + 1} value={option} />
    )),
  ];
  return (
    <FormGroup
      labelInfo={labelInfo}
      label={label}
      fieldId={fieldId}
      labelIcon={labelIcon}
      isRequired={isRequired}
    >
      <Select
        selections={value}
        onSelect={onSelect}
        onToggle={setIsOpen}
        isOpen={isOpen}
        className="without_select2"
        maxHeight="45vh"
        placeholderText=" " // To prevent showing first option as selected
        aria-labelledby={fieldId}
        toggleAriaLabel={`${label} toggle`}
        {...props}
      >
        {selectOptions.filter(option => option)}
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
  labelIcon: PropTypes.node,
  isRequired: PropTypes.bool,
};

SelectField.defaultProps = {
  label: null,
  labelInfo: null,
  options: [],
  labelIcon: null,
  value: null,
  isRequired: false,
};
