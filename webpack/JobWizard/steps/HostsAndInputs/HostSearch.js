import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import SearchBar from 'foremanReact/components/SearchBar';
import { hostQuerySearchID, hostsSearchProps } from '../../JobWizardConstants';
import { selectHostBookmarks } from '../../JobWizardSelectors';

export const HostSearch = ({ value, setValue, onBookmarkMatch }) => {
  const bookmarks = useSelector(selectHostBookmarks);

  const handleSearchChange = search => {
    setValue(search);
    const matched = bookmarks.find(
      bookmark => bookmark.query && bookmark.query.trim() === search.trim()
    );
    onBookmarkMatch(
      matched
        ? { id: matched.id, name: matched.name, query: matched.query }
        : null
    );
  };

  return (
    <div className="foreman-search-field">
      <SearchBar
        data={{
          ...hostsSearchProps,
          autocomplete: {
            id: hostQuerySearchID,
            url: '/hosts/auto_complete_search',
            searchQuery: value,
          },
        }}
        onSearch={null}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
};

HostSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  onBookmarkMatch: PropTypes.func.isRequired,
};
