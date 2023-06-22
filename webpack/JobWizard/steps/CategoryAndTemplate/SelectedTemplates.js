import React from 'react';
import PropTypes from 'prop-types';
import { Chip, ChipGroup, Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

const SelectedTemplate = ({ selected, setSelected, categoryName }) => {
  const deleteItem = itemToRemove => {
    setSelected(oldSelected =>
      oldSelected.filter(item => item.id !== itemToRemove)
    );
  };
  return (
    <ChipGroup className="templates-chip-group" categoryName={categoryName}>
      {selected.map(({ name, id }, index) => (
        <Chip
          key={index}
          id={`${categoryName}-${id}`}
          onClick={() => deleteItem(id)}
          closeBtnAriaLabel={`Close ${name}`}
        >
          {name}
        </Chip>
      ))}
    </ChipGroup>
  );
};

export const SelectedTemplates = ({
  selectedOutputTemplates,
  setOutputTemplates,
  runtimeTemplate,
  setRuntimeTemplate,
}) => {
  const clearAll = () => {
    setOutputTemplates(() => []);
    setRuntimeTemplate(() => '');
  };
  return (
    <div className="selected-chips">
      <SelectedTemplate
        selected={selectedOutputTemplates}
        categoryName="Predefined templates"
        setSelected={setOutputTemplates}
      />
      <Button variant="link" className="clear-chips" onClick={clearAll}>
        {__('Clear templates')}
      </Button>
    </div>
  );
};

SelectedTemplates.propTypes = {
  selectedOutputTemplates: PropTypes.array.isRequired,
  setOutputTemplates: PropTypes.func.isRequired,
  runtimeTemplate: PropTypes.string.isRequired,
  setRuntimeTemplate: PropTypes.func.isRequired,
};

SelectedTemplate.propTypes = {
  categoryName: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
