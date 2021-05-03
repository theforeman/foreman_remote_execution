import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';

import SearchBar from 'foremanReact/components/SearchBar';
import Pagination from 'foremanReact/components/Pagination/PaginationWrapper';
import { getControllerSearchProps } from 'foremanReact/constants';

import TargetingHosts from './TargetingHosts';
import './TargetingHostsPage.scss';

const TargetingHostsPage = ({
  handleSearch,
  searchQuery,
  apiStatus,
  items,
  totalHosts,
  pagination,
  handlePagination,
}) => (
  <div id="targeting_hosts">
    <Grid.Row>
      <Grid.Col md={6} className="title_filter">
        <SearchBar
          onSearch={query => handleSearch(query)}
          data={{
            ...getControllerSearchProps('hosts'),
            autocomplete: {
              id: 'targeting_hosts_search',
              searchQuery,
              url: '/hosts/auto_complete_search',
              useKeyShortcuts: true,
            },
            bookmarks: {},
          }}
        />
      </Grid.Col>
    </Grid.Row>
    <br />
    <TargetingHosts apiStatus={apiStatus} items={items} />
    <Pagination
      viewType="table"
      itemCount={totalHosts}
      pagination={pagination}
      onChange={args => handlePagination(args)}
      dropdownButtonId="targeting-hosts-pagination-dropdown"
      className="targeting-hosts-pagination"
    />
  </div>
);

TargetingHostsPage.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  apiStatus: PropTypes.string,
  items: PropTypes.array.isRequired,
  totalHosts: PropTypes.number.isRequired,
  pagination: PropTypes.object.isRequired,
  handlePagination: PropTypes.func.isRequired,
};

TargetingHostsPage.defaultProps = {
  apiStatus: null,
};

export default TargetingHostsPage;
