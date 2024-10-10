/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
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
import { getControllerSearchProps } from 'foremanReact/constants';
import Columns, {
  JOB_INVOCATION_HOSTS,
  STATUS_UPPERCASE,
} from './JobInvocationConstants';

const JobInvocationHostTable = ({ id, targeting }) => {
  const columns = Columns();
  const columnNamesKeys = Object.keys(columns);
  const apiOptions = { key: JOB_INVOCATION_HOSTS, search: urlSearchQuery };
  const {
    search: urlSearchQuery = '',
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

  const { setParamsAndAPI, params } = useSetParamsAndApiAndSearch({
    defaultParams,
    apiOptions,
    setAPIOptions,
  });

  const combinedResponse = {
    response: {
      search: '',
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
};

JobInvocationHostTable.defaultProps = {};

export default JobInvocationHostTable;
