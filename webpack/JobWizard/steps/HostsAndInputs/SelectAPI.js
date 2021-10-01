import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import URI from 'urijs';
import { SelectVariant } from '@patternfly/react-core';
import { get } from 'foremanReact/redux/API';
import { selectResponse, selectIsLoading } from '../../JobWizardSelectors';
import { SearchSelect } from '../form/SearchSelect';

export const useNameSearchAPI = (apiKey, url) => {
  const dispatch = useDispatch();
  const uri = new URI(url);
  const onSearch = search =>
    dispatch(
      get({
        key: apiKey,
        url: uri.addSearch({
          search: `name~"${search}"`,
        }),
      })
    );

  const response = useSelector(state => selectResponse(state, apiKey));
  const isLoading = useSelector(state => selectIsLoading(state, apiKey));
  return [onSearch, response, isLoading];
};

export const SelectAPI = props => (
  <SearchSelect
    {...props}
    variant={SelectVariant.typeaheadMulti}
    useNameSearch={useNameSearchAPI}
  />
);
