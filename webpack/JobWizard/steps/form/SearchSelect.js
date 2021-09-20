import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Select,
  SelectOption,
  SelectVariant,
  Spinner,
} from '@patternfly/react-core';
import Immutable from 'seamless-immutable';
import URI from 'urijs';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { get } from 'foremanReact/redux/API';
import { selectResponse, selectIsLoading } from '../../JobWizardSelectors';

const maxResults = 100;
export const useNameSearchAPI = (url, apiKey) => {
  const dispatch = useDispatch();
  const onSearch = search =>
    dispatch(
      get({
        key: apiKey,
        url: search
          ? url.addSearch({
              name: search,
              limit: maxResults,
            })
          : url,
      })
    );

  const response = useSelector(state => selectResponse(state, apiKey));
  const isLoading = useSelector(state => selectIsLoading(state, apiKey));
  return [onSearch, response, isLoading];
};

export const SearchSelect = ({
  name,
  selected,
  setSelected,
  placeholderText,
  url,
  apiKey,
}) => {
  const [setSearch, response, isLoading] = useNameSearchAPI(
    new URI(url),
    apiKey
  );
  const [isOpen, setIsOpen] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const autoSearchDelay = 500;
  useEffect(() => {
    setSearch(selected.name || '');
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
    setSelected(response.results.find(r => r.id === selection)); // saving the name and id so we will have access to the name between steps
  };
  const autoSearch = searchTerm => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setSearch(searchTerm), autoSearchDelay));
  };
  return (
    <Select
      toggleAriaLabel={`${name} toggle`}
      chipGroupComponent={<></>}
      variant={SelectVariant.typeahead}
      selections={selected.id}
      toggleIcon={isLoading && <Spinner size="sm" />}
      onSelect={onSelect}
      onToggle={setIsOpen}
      isOpen={isOpen}
      className="without_select2"
      maxHeight="45vh"
      onTypeaheadInputChanged={value => {
        autoSearch(value || '');
      }}
      placeholderText={placeholderText}
      onFilter={() => null}
      typeAheadAriaLabel={`${name} typeahead input`}
    >
      {selectOptions}
    </Select>
  );
};

SearchSelect.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.object,
  setSelected: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

SearchSelect.defaultProps = {
  name: 'typeahead select',
  selected: {},
  placeholderText: '',
};
