import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextInput, Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const DescriptionField = ({ inputs, value, setValue }) => {
  const generateDesc = () => {
    let newDesc = value;
    if (value) {
      const re = new RegExp('%\\{([^\\}]+)\\}', 'gm');
      const results = [...newDesc.matchAll(re)].map(result => ({
        name: result[1],
        text: result[0],
      }));
      results.forEach(result => {
        newDesc = newDesc.replace(
          result.text,
          // TODO: Replace with the value of the input from Target Hosts step
          inputs.find(input => input.name === result.name)?.name || result.text
        );
      });
    }
    return newDesc;
  };
  const [generatedDesc, setGeneratedDesc] = useState(generateDesc());
  const [isPreview, setIsPreview] = useState(true);

  const togglePreview = () => {
    setGeneratedDesc(generateDesc());
    setIsPreview(v => !v);
  };

  return (
    <FormGroup
      label={__('Description')}
      fieldId="description"
      helperText={
        <Button variant="link" isInline onClick={togglePreview}>
          {isPreview
            ? __('Edit job description template')
            : __('Preview job description')}
        </Button>
      }
    >
      {isPreview ? (
        <TextInput id="description-preview" value={generatedDesc} isDisabled />
      ) : (
        <TextInput
          type="text"
          autoComplete="description"
          id="description"
          value={value}
          onChange={newValue => setValue(newValue)}
        />
      )}
    </FormGroup>
  );
};

DescriptionField.propTypes = {
  inputs: PropTypes.array.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};
DescriptionField.defaultProps = {
  value: '',
};
