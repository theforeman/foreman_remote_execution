import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';

import SearchBar from 'foremanReact/components/SearchBar';
import Pagination from 'foremanReact/components/Pagination';
import { getControllerSearchProps } from 'foremanReact/constants';

import TargetingHosts from './TargetingHosts';
import { TARGETING_HOSTS_AUTOCOMPLETE } from './TargetingHostsConsts';
import './TargetingHostsPage.scss';

const TargetingHostsPage = ({
  handleSearch,
  searchQuery,
  apiStatus,
  items,
  totalHosts,
  handlePagination,
  page,
}) => (
  <div id="targeting_hosts">
    <Grid.Row>
      <Grid.Col md={6} className="title_filter">
        <SearchBar
          onSearch={query => handleSearch(query)}
          data={{
            ...getControllerSearchProps('hosts', TARGETING_HOSTS_AUTOCOMPLETE),
            autocomplete: {
              id: TARGETING_HOSTS_AUTOCOMPLETE,
              searchQuery,
              url: '/hosts/auto_complete_search',
              useKeyShortcuts: true,
            },
          }}
          onBookmarkClick={handleSearch}
        />
      </Grid.Col>
    </Grid.Row>
    <br />
    <TargetingHosts apiStatus={apiStatus} items={items} />
    <Pagination
      page={page}
      itemCount={totalHosts}
      onChange={args => handlePagination(args)}
      className="targeting-hosts-pagination"
      updateParamsByUrl={false}
    />
  </div>
);

TargetingHostsPage.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  apiStatus: PropTypes.string,
  items: PropTypes.array.isRequired,
  totalHosts: PropTypes.number.isRequired,
  handlePagination: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

TargetingHostsPage.defaultProps = {
  apiStatus: null,
};

export default TargetingHostsPage;
