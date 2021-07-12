import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, TextInput, TextArea } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import SearchBar from 'foremanReact/components/SearchBar';
import { getControllerSearchProps } from 'foremanReact/constants';
import { helpLabel } from './FormHelpers';
import { SelectField } from './SelectField';
import { SearchSelect } from './SearchSelect';

const TemplateSearchField = ({
  name,
  controller,
  url,
  labelText,
  required,
  defaultValue,
  setValue,
  values,
}) => {
  const searchQuery = useSelector(
    state => state.autocomplete?.[name]?.searchQuery
  );
  useEffect(() => {
    setValue({ ...values, [name]: searchQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);
  const id = name.replace(/ /g, '-');
  const props = getControllerSearchProps(controller.replace('/', '_'), name);
  return (
    <FormGroup
      label={name}
      labelIcon={helpLabel(labelText, name)}
      fieldId={id}
      isRequired={required}
      className="foreman-search-field"
    >
      <div className="foreman-search-field">
        <SearchBar
          initialQuery={defaultValue}
          data={{
            ...props,
            autocomplete: {
              id: name,
              url,
              useKeyShortcuts: true,
            },
          }}
          onSearch={() => null}
        />
      </div>
    </FormGroup>
  );
};

export const formatter = (input, values, setValue) => {
  const isSelectType = !!input?.options;
  const inputType = input.value_type;
  const isTextType = inputType === 'plain' || !inputType; // null defaults to plain

  const {
    name,
    required,
    hidden_value: hidden,
    resource_type: resourceType,
    value_type: valueType,
  } = input;
  const labelText = input.description;
  const value = values[name];
  const id = name.replace(/ /g, '-');
  if (valueType === 'resource') {
    return (
      <FormGroup
        label={name}
        fieldId={id}
        labelIcon={helpLabel(labelText, name)}
        isRequired={required}
        key={id}
      >
        <SearchSelect
          name={name}
          apiKey={resourceType.replace('::', '')}
          url={`/ui_job_wizard/resources?resource=${resourceType}`}
          selected={value || {}}
          setSelected={newValue => setValue({ ...values, [name]: newValue })}
        />
      </FormGroup>
    );
  }
  if (isSelectType) {
    const options = input.options.split(/\r?\n/).map(option => option.trim());
    return (
      <SelectField
        aria-label={name}
        key={id}
        isRequired={required}
        label={name}
        fieldId={id}
        options={options}
        labelIcon={helpLabel(labelText, name)}
        value={value}
        setValue={newValue => setValue({ ...values, [name]: newValue })}
      />
    );
  }
  if (isTextType) {
    return (
      <FormGroup
        key={name}
        label={name}
        labelIcon={helpLabel(labelText, name)}
        fieldId={id}
        isRequired={required}
      >
        <TextArea
          aria-label={name}
          className={hidden ? 'masked-input' : null}
          required={required}
          rows={2}
          id={id}
          value={value}
          onChange={newValue => setValue({ ...values, [name]: newValue })}
        />
      </FormGroup>
    );
  }
  if (inputType === 'date') {
    return (
      <FormGroup
        key={name}
        label={name}
        labelIcon={helpLabel(labelText, name)}
        fieldId={id}
        isRequired={required}
      >
        <TextInput
          aria-label={name}
          placeholder="YYYY-mm-dd HH:MM"
          className={hidden ? 'masked-input' : null}
          required={required}
          id={id}
          type="text"
          value={value}
          onChange={newValue => setValue({ ...values, [name]: newValue })}
        />
      </FormGroup>
    );
  }
  if (inputType === 'search') {
    const { url, resource_type: controller } = input;
    // TODO: get text from redux autocomplete
    return (
      <TemplateSearchField
        key={id}
        name={name}
        defaultValue={value}
        controller={controller}
        url={url}
        labelText={labelText}
        required={required}
        setValue={setValue}
        values={values}
      />
    );
  }

  return null;
};

TemplateSearchField.propTypes = {
  name: PropTypes.string.isRequired,
  controller: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  required: PropTypes.bool.isRequired,
  defaultValue: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};
TemplateSearchField.defaultProps = {
  labelText: null,
  defaultValue: '',
};
