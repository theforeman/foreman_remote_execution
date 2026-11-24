import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'seamless-immutable';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { DEBOUNCE_API } from '../../JobWizardConstants';
import { TypeaheadSelect } from './TypeaheadSelect';

export const maxResults = 100;

export const SearchSelect = ({
  name,
  selected,
  setSelected,
  placeholderText,
  useNameSearch,
  apiKey,
  url,
  isMulti,
  setLabel,
}) => {
  const [onSearch, response, isLoading] = useNameSearch(apiKey, url);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      onSearch(selected.name || '');
      initializedRef.current = true;
    }
  }, [onSearch, selected.name]);

  const tooManyOption =
    response.subtotal > maxResults
      ? [
          {
            key: 'too-many',
            value: '__too_many__',
            isDisabled: true,
            description: __('Please refine your search.'),
            label: sprintf(
              __('You have %s results to display. Showing first %s results'),
              response.subtotal,
              maxResults
            ),
          },
        ]
      : [];
  const options = [
    ...tooManyOption,
    ...Immutable.asMutable(response?.results || []).map((result, index) => ({
      key: result.id ?? index,
      value: result.id,
      label: setLabel(result),
    })),
  ];

  const onSelect = selection => {
    const result = response.results.find(item => item.id === selection);
    if (!result) {
      return;
    }
    if (!isMulti) {
      setSelected(result);
      return;
    }
    if (selected.map(({ id }) => id).includes(selection)) {
      setSelected(currentSelected =>
        currentSelected.filter(({ id }) => id !== selection)
      );
    } else {
      setSelected(currentSelected => [...currentSelected, result]);
    }
  };

  const autoSearch = searchTerm => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => onSearch(searchTerm), DEBOUNCE_API));
  };

  return (
    <TypeaheadSelect
      ouiaId={name}
      className="without_select2"
      isMulti={isMulti}
      options={options}
      selected={isMulti ? selected.map(({ id }) => id) : selected.id}
      isLoading={isLoading}
      onSelect={onSelect}
      onInputChange={value => autoSearch(value || '')}
      onClear={() => autoSearch('')}
      placeholder={placeholderText}
      maxMenuHeight="45vh"
      toggleAriaLabel={`${name} toggle`}
      typeAheadAriaLabel={`${name} typeahead input`}
    />
  );
};

SearchSelect.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setSelected: PropTypes.func.isRequired,
  setLabel: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  url: PropTypes.string,
  useNameSearch: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
};

SearchSelect.defaultProps = {
  name: 'typeahead select',
  selected: {},
  placeholderText: '',
  url: '',
  isMulti: false,
};
