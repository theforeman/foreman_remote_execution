import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FormGroup, TextInput, Tooltip, Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  selectTemplateInputs,
  selectAdvancedTemplateInputs,
} from '../../JobWizardSelectors';

export const DescriptionField = ({ inputValues, value, setValue }) => {
  const inputs = [
    ...useSelector(selectTemplateInputs),
    ...useSelector(selectAdvancedTemplateInputs),
  ].map(input => input.name);
  const generateDesc = useCallback(() => {
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
          inputValues[result.name] ||
            (inputs.includes(result.name) ? '' : result.text)
        );
      });
    }
    return newDesc;
  }, [inputs, value, inputValues]);
  const [generatedDesc, setGeneratedDesc] = useState(generateDesc());
  const [isPreview, setIsPreview] = useState(true);

  useEffect(() => {
    setGeneratedDesc(generateDesc());
  }, [generateDesc]);
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
        <Tooltip content={generatedDesc}>
          <div>
            {/* div wrapper so the tooltip will be shown in chrome */}
            <TextInput
              aria-label="description preview"
              id="description-preview"
              value={generatedDesc}
              isDisabled
            />
          </div>
        </Tooltip>
      ) : (
        <TextInput
          aria-label="description edit"
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
  inputValues: PropTypes.object.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};
DescriptionField.defaultProps = {
  value: '',
};
