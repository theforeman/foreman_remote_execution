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
    onBookmarkMatch(null);
  };

  const handleBookmarkSearch = query => {
    const matched = bookmarks.find(
      bookmark => bookmark.query && bookmark.query.trim() === query.trim()
    );
    if (matched) {
      onBookmarkMatch({
        id: matched.id,
        name: matched.name,
        query: matched.query,
      });
    } else {
      onBookmarkMatch(null);
    }
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
        onSearch={handleBookmarkSearch}
        onSearchChange={handleSearchChange}
        bookmarksPosition="right"
      />
    </div>
  );
};

HostSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  onBookmarkMatch: PropTypes.func.isRequired,
};
