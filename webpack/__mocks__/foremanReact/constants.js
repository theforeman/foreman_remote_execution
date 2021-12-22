export const STATUS = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  ERROR: 'ERROR',
};

export const getControllerSearchProps = (
  controller,
  id = 'searchBar',
  canCreate = true
) => ({
  controller,
  autocomplete: {
    id,
    searchQuery: '',
    url: `${controller}/auto_complete_search`,
    useKeyShortcuts: true,
  },
  bookmarks: {
    id,
    url: '/api/bookmarks',
    canCreate,
    documentationUrl: `4.1.5Searching`,
  },
});
