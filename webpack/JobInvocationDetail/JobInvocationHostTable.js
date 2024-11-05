/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import { Icon } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import { FormattedMessage } from 'react-intl';
import { Tr, Td } from '@patternfly/react-table';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
} from '@patternfly/react-core';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { Table } from 'foremanReact/components/PF4/TableIndexPage/Table/Table';
import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';
import { useSetParamsAndApiAndSearch } from 'foremanReact/components/PF4/TableIndexPage/Table/TableIndexHooks';
import {
  useBulkSelect,
  useUrlParams,
} from 'foremanReact/components/PF4/TableIndexPage/Table/TableHooks';
import Pagination from 'foremanReact/components/Pagination';
import { getControllerSearchProps } from 'foremanReact/constants';
import Columns, {
  JOB_INVOCATION_HOSTS,
  STATUS_UPPERCASE,
} from './JobInvocationConstants';

const JobInvocationHostTable = ({ id, targeting, finished, autoRefresh }) => {
  const columns = Columns();
  const columnNamesKeys = Object.keys(columns);
  const apiOptions = { key: JOB_INVOCATION_HOSTS };
  const {
    searchParam: urlSearchQuery = '',
    page: urlPage,
    per_page: urlPerPage,
  } = useUrlParams();
  const defaultParams = { search: urlSearchQuery };
  if (urlPage) defaultParams.page = Number(urlPage);
  if (urlPerPage) defaultParams.per_page = Number(urlPerPage);
  const { response, status, setAPIOptions } = useAPI(
    'get',
    `/api/job_invocations/${id}/hosts`,
    {
      params: { ...defaultParams, key: JOB_INVOCATION_HOSTS },
    }
  );

  const combinedResponse = {
    response: {
      search: urlSearchQuery,
      can_create: false,
      results: response?.results || [],
      total: response?.total || 0,
      per_page: response?.perPage,
      page: response?.page,
      subtotal: response?.subtotal || 0,
      message: response?.message || 'error',
    },
    status,
    setAPIOptions,
  };

  const { setParamsAndAPI, params } = useSetParamsAndApiAndSearch({
    defaultParams,
    apiOptions,
    setAPIOptions: combinedResponse.setAPIOptions,
  });

  const { updateSearchQuery } = useBulkSelect({
    initialSearchQuery: urlSearchQuery,
  });

  const controller = 'hosts';
  const memoDefaultSearchProps = useMemo(
    () => getControllerSearchProps(controller),
    [controller]
  );
  memoDefaultSearchProps.autocomplete.url = foremanUrl(
    `/${controller}/auto_complete_search`
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!finished || autoRefresh) {
        setAPIOptions(prevOptions => ({
          ...prevOptions,
          params: {
            ...prevOptions.params,
          },
        }));
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [finished, autoRefresh, setAPIOptions]);

  const onPagination = newPagination => {
    setParamsAndAPI({
      ...params,
      ...newPagination,
      search: urlSearchQuery,
    });
  };

  const bottomPagination = (
    <Pagination
      ouiaId="table-hosts-bottom-pagination"
      key="table-bottom-pagination"
      page={params.page}
      perPage={params.perPage}
      itemCount={response?.subtotal}
      onChange={onPagination}
    />
  );

  const customEmptyState = (
    <Tr ouiaId="table-empty">
      <Td colSpan={100}>
        <EmptyState variant={EmptyStateVariant.xl}>
          <span className="empty-state-icon">
            <Icon name="add-circle-o" type="pf" size="2x" />
          </span>
          <Title ouiaId="empty-state-header" headingLevel="h5" size="4xl">
            {__('No Results')}
          </Title>
          <EmptyStateBody>
            <div className="empty-state-description">
              {targeting?.targeting_type === 'dynamic_query' ? (
                <FormattedMessage
                  id="view-dynamic-hosts"
                  defaultMessage={__(
                    'The dynamic query is still being processed. You can {viewTheHosts} targeted by the query.'
                  )}
                  values={{
                    viewTheHosts: (
                      <a href={`/new/hosts?search=${targeting?.search_query}`}>
                        {__('view the hosts')}
                      </a>
                    ),
                  }}
                />
              ) : (
                __('No hosts found')
              )}
            </div>
          </EmptyStateBody>
        </EmptyState>
      </Td>
    </Tr>
  );

  return (
    <TableIndexPage
      apiUrl=""
      apiOptions={apiOptions}
      customSearchProps={memoDefaultSearchProps}
      controller="hosts"
      creatable={false}
      replacementResponse={combinedResponse}
      updateSearchQuery={updateSearchQuery}
    >
      <Table
        ouiaId="job-invocation-hosts-table"
        columns={columns}
        customEmptyState={
          status === STATUS_UPPERCASE.RESOLVED && !response?.results?.length
            ? customEmptyState
            : null
        }
        params={params}
        setParams={setParamsAndAPI}
        itemCount={response?.subtotal}
        results={response?.results}
        url=""
        refreshData={() => {}}
        errorMessage={
          status === STATUS_UPPERCASE.ERROR && response?.message
            ? response.message
            : null
        }
        isPending={status === STATUS_UPPERCASE.PENDING}
        isDeleteable={false}
        bottomPagination={bottomPagination}
      >
        {response?.results?.map((result, rowIndex) => (
          <Tr key={rowIndex} ouiaId={`table-row-${rowIndex}`}>
            {columnNamesKeys.map(k => (
              <Td key={k}>{columns[k].wrapper(result)}</Td>
            ))}
          </Tr>
        ))}
      </Table>
    </TableIndexPage>
  );
};

JobInvocationHostTable.propTypes = {
  id: PropTypes.string.isRequired,
  targeting: PropTypes.object.isRequired,
  finished: PropTypes.bool.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
};

JobInvocationHostTable.defaultProps = {};

export default JobInvocationHostTable;
