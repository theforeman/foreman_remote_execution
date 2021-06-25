import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextInput, Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const DescriptionField = ({ inputValues, value, setValue }) => {
  const generateDesc = () => {
    let newDesc = value;
    if (value) {
      const re = new RegExp('%\\{([^\\}]+)\\}', 'gm');
      const results = [...newDesc.matchAll(re)].map(result => ({
        name: result[1],
        text: result[0],
      }));
      results.forEach(result => {
        newDesc = newDesc.replace(result.text, inputValues[result.name]);
      });
    }
    return newDesc;
  };
  const [generatedDesc, setGeneratedDesc] = useState(generateDesc());
  const [isPreview, setIsPreview] = useState(true);

  const togglePreview = newValue => {
    setGeneratedDesc(generateDesc());
    setIsPreview(newValue);
  };

  const showPreview = (
    <Button variant="link" isInline onClick={() => togglePreview(true)}>
      {__('See the custom job description')}
    </Button>
  );
  const hidePreview = (
    <Button variant="link" isInline onClick={() => togglePreview(false)}>
      {__('Set the custom job description')}
    </Button>
  );
  return (
    <FormGroup
      label={__('Description')}
      fieldId="description"
      helperText={isPreview ? hidePreview : showPreview}
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
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  inputValues: PropTypes.object.isRequired,
};
DescriptionField.defaultProps = {
  value: '',
};
