import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ onChange }) => (
  <input
    className="foreman-search"
    onChange={onChange}
    placeholder="Filter..."
  />
);
export default SearchBar;

SearchBar.propTypes = {
  onChange: PropTypes.func,
};

SearchBar.defaultProps = {
  onChange: () => null,
};
