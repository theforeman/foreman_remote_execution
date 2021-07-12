import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Select,
  SelectOption,
  SelectVariant,
  Spinner,
} from '@patternfly/react-core';
import URI from 'urijs';
import { sprintf } from 'foremanReact/common/I18n';
import { get } from 'foremanReact/redux/API';
import { selectResponse, selectIsLoading } from '../../JobWizardSelectors';

export const useNameSearch = (url, apiKey) => {
  const dispatch = useDispatch();
  const onSearch = search =>
    dispatch(
      get({
        key: apiKey,
        url: search
          ? url.addSearch({
              search: `name~"${search}"`,
            })
          : url,
      })
    );

  const response = useSelector(state => selectResponse(state, apiKey));
  const isLoading = useSelector(state => selectIsLoading(state, apiKey));
  return [onSearch, response, isLoading];
};

export const HostSelect = ({
  selectedHosts,
  setSelectedHosts,
  apiKey,
  url,
  placeholderText,
}) => {
  const [onSearch, response, isLoading] = useNameSearch(new URI(url), apiKey);
  const [isOpen, setIsOpen] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const autoSearchDelay = 500;
  useEffect(() => {
    onSearch('');
    if (typingTimeout) {
      return () => clearTimeout(typingTimeout);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tooManyHosts = response.subtotal > 100;
  let hostsOptions;
  if (tooManyHosts) {
    hostsOptions = [
      <SelectOption isDisabled key={0}>
        {sprintf(
          'You have %s hosts to display. Please refine your search.',
          response.subtotal
        )}
      </SelectOption>,
    ];
  } else {
    hostsOptions = response?.results?.map((host, index) => (
      <SelectOption key={index} value={host.name} />
    ));
  }
  const onSelect = (event, selection) => {
    if (selectedHosts.includes(selection)) {
      setSelectedHosts(currentSelectedHost =>
        currentSelectedHost.filter(item => item !== selection)
      );
    } else {
      setSelectedHosts(currentSelectedHost => [
        ...currentSelectedHost,
        selection,
      ]);
    }
  };
  const autoSearch = searchTerm => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => onSearch(searchTerm), autoSearchDelay));
  };
  return (
    <>
      <Select
        chipGroupComponent={<></>}
        variant={SelectVariant.typeaheadMulti}
        selections={selectedHosts}
        toggleIcon={isLoading && <Spinner size="sm" />}
        onSelect={onSelect}
        onToggle={setIsOpen}
        isOpen={isOpen}
        className="without_select2"
        maxHeight="40vh"
        width="450px"
        onTypeaheadInputChanged={value => {
          autoSearch(value || '');
        }}
        placeholderText={placeholderText}
      >
        {hostsOptions}
      </Select>
    </>
  );
};

HostSelect.propTypes = {
  selectedHosts: PropTypes.array.isRequired,
  setSelectedHosts: PropTypes.func.isRequired,
  apiKey: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  placeholderText: PropTypes.string.isRequired,
};
