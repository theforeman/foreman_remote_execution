import { getURI } from 'foremanReact/common/urlHelpers';

export const getApiUrl = (searchQuery, pagination) => {
  const baseUrl = getURI()
    .search('')
    .addQuery('page', pagination.page)
    .addQuery('per_page', pagination.perPage);

  return searchQuery ? baseUrl.addQuery('search', searchQuery) : baseUrl;
};
