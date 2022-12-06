import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from 'foremanReact/components/SearchBar';
import { getControllerSearchProps } from 'foremanReact/constants';
import { hostsController, hostQuerySearchID } from '../../JobWizardConstants';

export const HostSearch = ({ value, setValue }) => {
  const props = getControllerSearchProps(hostsController, hostQuerySearchID);
  return (
    <div className="foreman-search-field">
      <SearchBar
        data={{
          ...props,
          autocomplete: {
            id: hostQuerySearchID,
            url: '/hosts/auto_complete_search',
            searchQuery: value,
          },
        }}
        onSearch={null}
        onSearchChange={search => setValue(search)}
      />
    </div>
  );
};

HostSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};
