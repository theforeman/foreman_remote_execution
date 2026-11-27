import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  ValidatedOptions,
} from '@patternfly/react-core';
import {
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import Immutable from 'seamless-immutable';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { DEBOUNCE_API } from '../../JobWizardConstants';

export const maxResults = 100;

const SCOPED_SEARCH_CHAR_PATTERN = /[=^~<>!()|"'\\]/;
const SCOPED_SEARCH_KEYWORD_PATTERN = /\b(and|or|not)\b/i;

const containsScopedSearchSyntax = text => {
  const value = text?.trim();
  if (!value) return false;
  return (
    SCOPED_SEARCH_CHAR_PATTERN.test(value) ||
    SCOPED_SEARCH_KEYWORD_PATTERN.test(value)
  );
};

export const SearchSelect = ({
  name,
  selected,
  setSelected,
  placeholderText,
  useNameSearch,
  apiKey,
  url,
  variant,
  setLabel,
  warnOnScopedSearchSyntax,
}) => {
  const [onSearch, response, isLoading] = useNameSearch(apiKey, url);
  const [isOpen, setIsOpen] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [typeaheadFilter, setTypeaheadFilter] = useState('');
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      onSearch(selected.name || '');
      initializedRef.current = true;
    }
  }, [onSearch, selected.name]);
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
        {setLabel(result)}
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
    if (warnOnScopedSearchSyntax && containsScopedSearchSyntax(searchTerm)) {
      return;
    }
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => onSearch(searchTerm), DEBOUNCE_API));
  };
  const showSearchSyntaxWarning =
    warnOnScopedSearchSyntax && containsScopedSearchSyntax(typeaheadFilter);

  const searchSyntaxMessage = __(
    'Search operators are only supported when using the Search query filter. Switch to Search query or type a plain name to filter.'
  );

  return (
    <div className="job-wizard-typeahead-filter">
      <FormGroup fieldId={`${name}-typeahead-filter`} hasNoPaddingTop isStack>
        <Select
          ouiaId={name}
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
          onToggle={(_event, val) => setIsOpen(val)}
          isOpen={isOpen}
          className="without_select2"
          maxHeight="45vh"
          shouldResetOnSelect={false}
          validated={
            showSearchSyntaxWarning
              ? ValidatedOptions.error
              : ValidatedOptions.noval
          }
          onTypeaheadInputChanged={value => {
            const filter = value || '';
            setTypeaheadFilter(filter);
            autoSearch(filter);
          }}
          placeholderText={placeholderText}
          typeAheadAriaLabel={`${name} typeahead input`}
        >
          {selectOptions}
        </Select>
        {!isOpen && typeaheadFilter && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                {sprintf(__('Current filter: %s'), typeaheadFilter)}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
        {showSearchSyntaxWarning && (
          <Alert
            ouiaId={`${name}-search-syntax-warning`}
            variant="danger"
            isInline
            title={searchSyntaxMessage}
          />
        )}
      </FormGroup>
    </div>
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
  variant: PropTypes.string,
  warnOnScopedSearchSyntax: PropTypes.bool,
};

SearchSelect.defaultProps = {
  name: 'typeahead select',
  selected: {},
  placeholderText: '',
  url: '',
  variant: SelectVariant.typeahead,
  warnOnScopedSearchSyntax: false,
};
