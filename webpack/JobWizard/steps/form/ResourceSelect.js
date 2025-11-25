import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import Immutable from 'seamless-immutable';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
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
  const { perPage } = useForemanSettings();
  const maxResults = perPage;
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
  if (response?.subtotal > maxResults) {
    selectOptions = [
      <SelectOption
        isDisabled
        key={0}
        description={__('Please refine your search.')}
      >
        {sprintf(
          __('You have more results to display. Showing first %s results'),
          maxResults
        )}
      </SelectOption>,
    ];
  }
  selectOptions = [
    ...selectOptions,
    ...Immutable.asMutable(response?.results || [])
      ?.slice(0, maxResults)
      ?.map((result, index) => (
        <SelectOption key={index + 1} value={result.id}>
          {result.name}
        </SelectOption>
      )),
  ];

  const onSelect = (event, selection) => {
    setSelected(selection);
    setIsOpen(false);
  };
  const onFilter = (_, value) => {
    if (!value) {
      return selectOptions;
    }
    return selectOptions.filter(
      o =>
        typeof o.props.children === 'string' &&
        o.props.children.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  };
  const onClear = () => {
    setSelected(null);
    setIsOpen(false);
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
    <Select
      ouiaId={name}
      toggleAriaLabel={`${name} toggle`}
      chipGroupComponent={<></>}
      variant={SelectVariant.typeahead}
      selections={selected}
      loadingVariant={isLoading ? 'spinner' : null}
      onSelect={onSelect}
      onToggle={(_event, val) => setIsOpen(val)}
      onFilter={(_event, val) => onFilter(val)}
      onClear={(_event, val) => onClear(val)}
      isOpen={isOpen}
      className="without_select2"
      maxHeight="45vh"
      onTypeaheadInputChanged={value => {
        if (value) {
          autoSearch(value);
        } else {
          onClear();
        }
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
