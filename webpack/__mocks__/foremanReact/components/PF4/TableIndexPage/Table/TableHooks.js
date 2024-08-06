import { useState } from 'react';

export const useBulkSelect = ({ initialSearchQuery }) => {
  // eslint-disable-next-line no-unused-vars
  const [searchQuery, updateSearchQuery] = useState(initialSearchQuery);
  return updateSearchQuery;
};
export const useUrlParams = jest.fn();
// export const useBulkSelect = jest.fn();
