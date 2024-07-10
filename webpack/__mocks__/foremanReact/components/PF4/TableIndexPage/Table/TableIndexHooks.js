import { useState } from 'react';
import URI from 'urijs';
import { useHistory } from 'react-router-dom';

export const useSetParamsAndApiAndSearch = ({
  defaultParams,
  apiOptions,
  setAPIOptions,
  updateSearchQuery,
  pushToHistory = true,
}) => {
  const [params, setParams] = useState(defaultParams);
  const history = useHistory();
  const setParamsAndAPI = newParams => {
    // add url edit params to the new params
    if (pushToHistory) {
      const uri = new URI();
      uri.setSearch(newParams);
      history.push({ search: uri.search() });
    }
    setParams(newParams);
    setAPIOptions({ ...apiOptions, params: newParams });
  };

  const setSearch = newSearch => {
    if (pushToHistory) {
      const uri = new URI();
      uri.setSearch(newSearch);
      history.push({ search: uri.search() });
    }
    updateSearchQuery(newSearch.search);
    setParamsAndAPI({ ...params, ...newSearch });
  };

  return {
    setParamsAndAPI,
    setSearch,
    params,
  };
};
