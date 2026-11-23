import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'seamless-immutable';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import { useSelector, useDispatch } from 'react-redux';
import URI from 'urijs';
import { get } from 'foremanReact/redux/API';
import { selectResponse, selectIsLoading } from '../../JobWizardSelectors';
import { DEBOUNCE_API } from '../../JobWizardConstants';
import { TypeaheadSelect } from './TypeaheadSelect';

export const ResourceSelect = ({
  name,
  selected,
  setSelected,
  placeholderText,
  apiKey,
  url,
}) => {
  const { perPage } = useForemanSettings();
  const maxResults = perPage;
  const dispatch = useDispatch();
  const onSearch = useCallback(
    search => {
      const uri = new URI(url);
      dispatch(
        get({
          key: apiKey,
          url: uri.addSearch(search),
        })
      );
    },
    [dispatch, apiKey, url]
  );

  const response = useSelector(state => selectResponse(state, apiKey));
  const isLoading = useSelector(state => selectIsLoading(state, apiKey));
  const [filterValue, setFilterValue] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      onSearch(selected ? { id: selected } : {});
      initializedRef.current = true;
    }
  }, [onSearch, selected]);

  const tooManyOption =
    response.subtotal > maxResults
      ? [
          {
            key: 'too-many',
            value: '__too_many__',
            isDisabled: true,
            description: __('Please refine your search.'),
            label: sprintf(
              __('You have more results to display. Showing first %s results'),
              maxResults
            ),
          },
        ]
      : [];
  const resultOptions = Immutable.asMutable(response?.results || [])
    .slice(0, maxResults)
    .map((result, index) => ({
      key: result.id ?? index,
      value: result.id,
      label: result.name,
    }));
  const options = [...tooManyOption, ...resultOptions].filter(option => {
    if (!filterValue || option.isDisabled) {
      return true;
    }
    return String(option.label)
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  });

  const clearSelection = () => {
    setSelected(null);
    setFilterValue('');
    if (typingTimeout) clearTimeout(typingTimeout);
    onSearch({});
  };
  const autoSearch = searchTerm => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => onSearch({ name: searchTerm }), DEBOUNCE_API)
    );
  };

  return (
    <TypeaheadSelect
      ouiaId={name}
      className="without_select2"
      options={options}
      selected={selected}
      isLoading={isLoading}
      onSelect={setSelected}
      onClear={clearSelection}
      onInputChange={value => {
        setFilterValue(value);
        if (value) {
          autoSearch(value);
        } else {
          clearSelection();
        }
      }}
      placeholder={placeholderText}
      maxMenuHeight="45vh"
      toggleAriaLabel={`${name} toggle`}
      typeAheadAriaLabel={`${name} typeahead input`}
    />
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
  selected: '',
  placeholderText: '',
  url: '',
};
