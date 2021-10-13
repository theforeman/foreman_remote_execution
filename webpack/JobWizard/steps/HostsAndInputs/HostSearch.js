import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from 'foremanReact/components/SearchBar';
import { getControllerSearchProps } from 'foremanReact/constants';
import { hostsController, hostQuerySearchID } from '../../JobWizardConstants';
import { noop } from '../../../helpers';

export const HostSearch = ({ value, setValue }) => {
  const searchQuery = useSelector(
    state => state.autocomplete?.hostsSearch?.searchQuery
  );
  useEffect(() => {
    setValue(searchQuery || '');
  }, [setValue, searchQuery]);

  const props = getControllerSearchProps(hostsController, hostQuerySearchID);
  return (
    <div className="foreman-search-field">
      <SearchBar
        data={{
          ...props,
          autocomplete: {
            id: hostQuerySearchID,
            url: '/hosts/auto_complete_search',
            useKeyShortcuts: true,
          },
        }}
        onSearch={noop}
        initialQuery={value}
      />
    </div>
  );
};

HostSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};
