import React, { useState } from 'react';
import { FormGroup, Select, SelectOption } from '@patternfly/react-core';
import PropTypes from 'prop-types';

export const SelectField = ({ label, fieldId, options, value, setValue }) => {
  const onSelect = (event, selection) => {
    setValue(selection);
    setIsOpen(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FormGroup label={label} fieldId={fieldId}>
      <Select
        selections={value}
        onSelect={onSelect}
        onToggle={setIsOpen}
        isOpen={isOpen}
        className="without_select2"
        maxHeight="45vh"
      >
        {options.map((option, index) => (
          <SelectOption key={index} value={option} />
        ))}
      </Select>
    </FormGroup>
  );
};
SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setValue: PropTypes.func.isRequired,
};

SelectField.defaultProps = {
  options: [],
  value: null,
};
