import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import Immutable from 'seamless-immutable';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { DEBOUNCE_API } from '../../JobWizardConstants';

export const maxResults = 100;

export const SearchSelect = ({
  name,
  selected,
  setSelected,
  placeholderText,
  useNameSearch,
  apiKey,
  url,
  variant,
}) => {
  const [onSearch, response, isLoading] = useNameSearch(apiKey, url);
  const [isOpen, setIsOpen] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  useEffect(() => {
    onSearch(selected.name || '');
    if (typingTimeout) {
      return () => clearTimeout(typingTimeout);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let selectOptions = [];
  if (response.subtotal > maxResults) {
    selectOptions = [
      <SelectOption
        isDisabled
        key={0}
        description={__('Please refine your search.')}
      >
        {sprintf(
          __('You have %s results to display. Showing first %s results'),
          response.subtotal,
          maxResults
        )}
      </SelectOption>,
    ];
  }
  selectOptions = [
    ...selectOptions,
    ...Immutable.asMutable(response?.results || [])?.map((result, index) => (
      <SelectOption key={index + 1} value={result.id}>
        {result.name}
      </SelectOption>
    )),
  ];

  const onSelect = (event, selection) => {
    if (variant === SelectVariant.typeahead) {
      setSelected(response.results.find(r => r.id === selection)); // saving the name and id so we will have access to the name between steps
    } else if (variant === SelectVariant.typeaheadMulti) {
      if (selected.map(({ id }) => id).includes(selection)) {
        setSelected(currentSelected =>
          currentSelected.filter(({ id }) => id !== selection)
        );
      } else {
        setSelected(currentSelected => [
          ...currentSelected,
          response.results.find(r => r.id === selection),
        ]);
      }
    }
  };
  const autoSearch = searchTerm => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => onSearch(searchTerm), DEBOUNCE_API));
  };
  return (
    <Select
      toggleAriaLabel={`${name} toggle`}
      chipGroupComponent={<></>}
      variant={variant}
      selections={
        variant === SelectVariant.typeahead
          ? selected.id
          : selected.map(({ id }) => id)
      }
      loadingVariant={isLoading ? 'spinner' : null}
      onSelect={onSelect}
      onToggle={setIsOpen}
      isOpen={isOpen}
      className="without_select2"
      maxHeight="45vh"
      onTypeaheadInputChanged={value => {
        autoSearch(value || '');
      }}
      placeholderText={placeholderText}
      typeAheadAriaLabel={`${name} typeahead input`}
    >
      {selectOptions}
    </Select>
  );
};

SearchSelect.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setSelected: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  url: PropTypes.string,
  useNameSearch: PropTypes.func.isRequired,
  variant: PropTypes.string,
};

SearchSelect.defaultProps = {
  name: 'typeahead select',
  selected: {},
  placeholderText: '',
  url: '',
  variant: SelectVariant.typeahead,
};
