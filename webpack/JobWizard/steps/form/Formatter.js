import React from 'react';
import { FormGroup, TextArea } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import SearchBar from 'foremanReact/components/SearchBar';
import { getControllerSearchProps } from 'foremanReact/constants';
import { helpLabel, ResetDefault } from './FormHelpers';
import { SelectField } from './SelectField';
import { ResourceSelect } from './ResourceSelect';
import { DateTimePicker } from '../form/DateTimePicker';

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
  const id = name.replace(/ /g, '-');
  const props = getControllerSearchProps(controller.replace('/', '_'), name);
  return (
    <FormGroup
      label={name}
      labelIcon={helpLabel(labelText, name)}
      labelInfo={
        <ResetDefault
          defaultValue={defaultValue}
          setValue={search => setValue({ ...values, [name]: search })}
        />
      }
      fieldId={id}
      isRequired={required}
      className="foreman-search-field"
    >
      <SearchBar
        data={{
          ...props,
          autocomplete: {
            id: name,
            url,
            searchQuery: values[name],
          },
        }}
        onSearch={null}
        onSearchChange={search => setValue({ ...values, [name]: search })}
      />
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
    default: defaultValue,
  } = input;
  const labelText = input.description;
  const value = values[name];
  const id = name.replace(/ /g, '-');

  const labelInfo = (
    <ResetDefault
      defaultValue={defaultValue}
      setValue={newValue => setValue({ ...values, [name]: newValue })}
    />
  );

  if (valueType === 'resource') {
    return (
      <FormGroup
        label={name}
        fieldId={id}
        labelIcon={helpLabel(labelText, name)}
        isRequired={required}
        key={id}
        labelInfo={labelInfo}
      >
        <ResourceSelect
          name={name}
          apiKey={resourceType.replace('::', '')}
          url={`/ui_job_wizard/resources?resource=${resourceType}`}
          selected={value || ''}
          setSelected={newValue => setValue({ ...values, [name]: newValue })}
        />
      </FormGroup>
    );
  }
  if (isSelectType) {
    const options = input.options.split(/\r?\n/).map(option => option.trim());
    return (
      <SelectField
        labelInfo={labelInfo}
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
        labelInfo={labelInfo}
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
        labelInfo={labelInfo}
        key={name}
        label={name}
        labelIcon={helpLabel(labelText, name)}
        fieldId={id}
        isRequired={required}
      >
        <DateTimePicker
          ariaLabel={name}
          className={hidden ? 'masked-input' : null}
          id={id}
          dateTime={value}
          setDateTime={newValue => setValue({ ...values, [name]: newValue })}
          includeSeconds
        />
      </FormGroup>
    );
  }
  if (inputType === 'search') {
    const controller = input.resource_type_tableize;
    return (
      <TemplateSearchField
        key={id}
        name={name}
        defaultValue={defaultValue}
        controller={controller}
        url={`/${controller}/auto_complete_search`}
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
