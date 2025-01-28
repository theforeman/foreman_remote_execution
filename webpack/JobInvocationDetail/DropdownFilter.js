import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Select, SelectOption, SelectList } from '@patternfly/react-core/next'; // remove "/next" after switching to PF5
import { MenuToggle, ToolbarItem } from '@patternfly/react-core';
import { STATUS_TITLES } from './JobInvocationConstants';

export const DropdownFilter = ({ dropdownFilter, setDropdownFilter }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onSelect = (_event, itemId) => {
    setDropdownFilter(itemId);
    setIsOpen(false);
  };

  const toggle = toggleRef => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsOpen(!isOpen)}
      isExpanded={isOpen}
      style={{
        width: '200px',
      }}
    >
      {Object.values(STATUS_TITLES).find(status => status.id === dropdownFilter)
        ?.title || __('All statuses')}
    </MenuToggle>
  );

  return (
    <ToolbarItem>
      <Select
        isOpen={isOpen}
        selected={dropdownFilter}
        onSelect={onSelect}
        onOpenChange={newIsOpen => setIsOpen(newIsOpen)}
        ouiaId="host-status-select"
        toggle={toggle}
      >
        <SelectList>
          {Object.values(STATUS_TITLES).map(result => (
            <SelectOption
              key={result.id}
              itemId={result.id}
              isSelected={result.id === dropdownFilter}
            >
              {result.title}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarItem>
  );
};

DropdownFilter.propTypes = {
  dropdownFilter: PropTypes.string.isRequired,
  setDropdownFilter: PropTypes.func.isRequired,
};
