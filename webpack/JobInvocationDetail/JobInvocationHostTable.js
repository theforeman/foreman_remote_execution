/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, { useMemo, useEffect, useState } from 'react';
import { Icon } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import { FormattedMessage } from 'react-intl';
import { Tr, Td, Tbody, ExpandableRowContent } from '@patternfly/react-table';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateHeader,
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
import { TemplateInvocation } from './TemplateInvocation';
import { OpenAlInvocations, PopupAlert } from './OpenAlInvocations';
import { RowActions } from './TemplateInvocationComponents/TemplateActionButtons';
import JobInvocationHostTableToolbar from './JobInvocationHostTableToolbar';

const JobInvocationHostTable = ({
  id,
  targeting,
  finished,
  autoRefresh,
  initialFilter,
}) => {
  const columns = Columns();
  const columnNamesKeys = Object.keys(columns);
  const apiOptions = { key: JOB_INVOCATION_HOSTS };
  const [selectedFilter, setSelectedFilter] = useState(initialFilter || '');
  const {
    searchParam: urlSearchQuery = '',
    page: urlPage,
    per_page: urlPerPage,
  } = useUrlParams();
  const constructFilter = (
    filter = selectedFilter,
    search = urlSearchQuery
  ) => {
    const dropdownFilterClause =
      filter && filter !== 'all_statuses'
        ? `job_invocation.result = ${filter}`
        : null;
    const parts = [dropdownFilterClause, search];
    return parts
      .filter(x => x)
      .map(fragment => `(${fragment})`)
      .join(' AND ');
  };

  const search = constructFilter();
  const defaultParams = search !== '' ? { search } : {};
  if (urlPage) defaultParams.page = Number(urlPage);
  if (urlPerPage) defaultParams.per_page = Number(urlPerPage);
  const [expandedHost, setExpandedHost] = useState([]);
  const { response, status, setAPIOptions } = useAPI(
    'get',
    `/api/job_invocations/${id}/hosts`,
    {
      params: defaultParams,
    }
  );

  const { params } = useSetParamsAndApiAndSearch({
    defaultParams,
    apiOptions,
    setAPIOptions,
  });

  const { updateSearchQuery: updateSearchQueryBulk } = useBulkSelect({
    initialSearchQuery: urlSearchQuery,
  });
  const updateSearchQuery = searchQuery => {
    updateSearchQueryBulk(searchQuery);
  };

  const controller = 'hosts';
  const memoDefaultSearchProps = useMemo(
    () => getControllerSearchProps(controller),
    [controller]
  );
  memoDefaultSearchProps.autocomplete.url = foremanUrl(
    `/${controller}/auto_complete_search`
  );

  const wrapSetSelectedFilter = filter => {
    const filterSearch = constructFilter(filter);
    setAPIOptions(prevOptions => {
      if (prevOptions.params.search !== filterSearch) {
        return {
          ...prevOptions,
          params: {
            ...prevOptions.params,
            search: filterSearch,
          },
        };
      }
      return prevOptions;
    });
    setSelectedFilter(filter);
  };

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

  const wrapSetAPIOptions = newAPIOptions => {
    setAPIOptions(prevOptions => ({
      ...prevOptions,
      params: {
        ...prevOptions.params,
        ...newAPIOptions.params,
        search: constructFilter(undefined, newAPIOptions?.params?.search),
      },
    }));
  };

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
    setAPIOptions: wrapSetAPIOptions,
  };

  const customEmptyState = (
    <Tr ouiaId="table-empty">
      <Td colSpan={100}>
        <EmptyState variant={EmptyStateVariant.xl}>
          <span className="empty-state-icon">
            <Icon name="add-circle-o" type="pf" size="2x" />
          </span>
          <EmptyStateHeader
            titleText={<>{__('No Results')}</>}
            headingLevel="h5"
          />
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

  const { results = [] } = response;

  const isHostExpanded = host => expandedHost.includes(host);
  const setHostExpanded = (host, isExpanding = true) =>
    setExpandedHost(prevExpanded => {
      const otherExpandedHosts = prevExpanded.filter(h => h !== host);
      return isExpanding ? [...otherExpandedHosts, host] : otherExpandedHosts;
    });
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      {showAlert && <PopupAlert setShowAlert={setShowAlert} />}
      <TableIndexPage
        apiUrl=""
        apiOptions={apiOptions}
        customSearchProps={memoDefaultSearchProps}
        controller="hosts"
        creatable={false}
        replacementResponse={combinedResponse}
        updateSearchQuery={updateSearchQuery}
        customToolbarItems={[
          <OpenAlInvocations
            setShowAlert={setShowAlert}
            results={results}
            id={id}
            key="OpenAlInvocations"
          />,
          <JobInvocationHostTableToolbar
            dropdownFilter={selectedFilter}
            setDropdownFilter={wrapSetSelectedFilter}
            key="JobInvocationHostTableToolbar"
          />,
        ]}
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
          setParams={wrapSetAPIOptions}
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
          childrenOutsideTbody
        >
          {results?.map((result, rowIndex) => (
            <Tbody key={rowIndex}>
              <Tr ouiaId={`table-row-${rowIndex}`}>
                <Td
                  expand={{
                    rowIndex,
                    isExpanded: isHostExpanded(result.id),
                    onToggle: () =>
                      setHostExpanded(result.id, !isHostExpanded(result.id)),
                    expandId: 'host-expandable',
                  }}
                />
                {columnNamesKeys.slice(1).map(k => (
                  <Td key={k}>{columns[k].wrapper(result)}</Td>
                ))}
                <Td isActionCell>
                  <RowActions hostID={result.id} jobID={id} />
                </Td>
              </Tr>
              <Tr
                isExpanded={isHostExpanded(result.id)}
                ouiaId="table-row-expanded-sections"
              >
                <Td
                  dataLabel={`${result.id}-expandable-content`}
                  colSpan={columnNamesKeys.length + 1}
                >
                  <ExpandableRowContent>
                    {result.job_status === 'cancelled' ||
                    result.job_status === 'N/A' ? (
                      <div>
                        {__('A task for this host has not been started')}
                      </div>
                    ) : (
                      <TemplateInvocation hostID={result.id} jobID={id} />
                    )}
                  </ExpandableRowContent>
                </Td>
              </Tr>
            </Tbody>
          ))}
        </Table>
      </TableIndexPage>
    </>
  );
};

JobInvocationHostTable.propTypes = {
  id: PropTypes.string.isRequired,
  targeting: PropTypes.object.isRequired,
  finished: PropTypes.bool.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  initialFilter: PropTypes.string.isRequired,
};

JobInvocationHostTable.defaultProps = {};

export default JobInvocationHostTable;
