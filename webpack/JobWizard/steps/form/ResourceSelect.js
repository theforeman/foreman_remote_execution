import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import Immutable from 'seamless-immutable';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { useSelector, useDispatch } from 'react-redux';
import URI from 'urijs';
import { get } from 'foremanReact/redux/API';
import { selectResponse, selectIsLoading } from '../../JobWizardSelectors';
import { DEBOUNCE_API } from '../../JobWizardConstants';

export const ResourceSelect = ({
  name,
  selected,
  setSelected,
  placeholderText,
  apiKey,
  url,
}) => {
  const maxResults = 100;
  const dispatch = useDispatch();
  const uri = new URI(url);
  const onSearch = search => {
    dispatch(
      get({
        key: apiKey,
        url: uri.addSearch(search),
      })
    );
  };

  const response = useSelector(state => selectResponse(state, apiKey));
  const isLoading = useSelector(state => selectIsLoading(state, apiKey));
  const [isOpen, setIsOpen] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  useEffect(() => {
    onSearch(selected ? { id: selected } : {});
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
    setSelected(selection);
    setIsOpen(false);
  };
  const autoSearch = searchTerm => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => onSearch({ name: searchTerm }), DEBOUNCE_API)
    );
  };
  return (
    <Select
      toggleAriaLabel={`${name} toggle`}
      chipGroupComponent={<></>}
      variant={SelectVariant.typeahead}
      selections={selected}
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

ResourceSelect.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelected: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  url: PropTypes.string,
};

ResourceSelect.defaultProps = {
  name: 'typeahead select',
  selected: {},
  placeholderText: '',
  url: '',
};
