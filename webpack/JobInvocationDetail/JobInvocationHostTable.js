/* eslint-disable max-lines */
/* eslint-disable camelcase */
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateVariant,
  ToolbarItem,
} from '@patternfly/react-core';
import { ExpandableRowContent, Tbody, Td, Tr } from '@patternfly/react-table';
import { useDispatch } from 'react-redux';
import { APIActions } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { RowSelectTd } from 'foremanReact/components/HostsIndex/RowSelectTd';
import SelectAllCheckbox from 'foremanReact/components/PF4/TableIndexPage/Table/SelectAllCheckbox';
import { Table } from 'foremanReact/components/PF4/TableIndexPage/Table/Table';
import {
  useBulkSelect,
  useUrlParams,
} from 'foremanReact/components/PF4/TableIndexPage/Table/TableHooks';
import { getPageStats } from 'foremanReact/components/PF4/TableIndexPage/Table/helpers';
import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';
import { getControllerSearchProps } from 'foremanReact/constants';
import { Icon } from 'patternfly-react';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { CheckboxesActions } from './CheckboxesActions';
import DropdownFilter from './DropdownFilter';
import Columns, {
  JOB_INVOCATION_HOSTS,
  LIST_TEMPLATE_INVOCATIONS,
  STATUS_UPPERCASE,
  ALL_JOB_HOSTS,
} from './JobInvocationConstants';
import { TemplateInvocation } from './TemplateInvocation';
import { RowActions } from './TemplateInvocationComponents/TemplateActionButtons';

const JobInvocationHostTable = ({
  failedCount,
  id,
  initialFilter,
  onFilterUpdate,
  targeting,
}) => {
  const columns = Columns();
  const columnNamesKeys = Object.keys(columns);

  const history = useHistory();
  const dispatch = useDispatch();

  const [apiResponse, setApiResponse] = useState([]);
  const [status, setStatus] = useState(STATUS_UPPERCASE.PENDING);

  const [allHostsIds, setAllHostsIds] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  // Expansive items
  const [expandedHost, setExpandedHost] = useState([]);
  const isHostExpanded = host => expandedHost.includes(host);
  const setHostExpanded = (host, isExpanding = true) =>
    setExpandedHost(prevExpanded => {
      const otherExpandedHosts = prevExpanded.filter(h => h !== host);
      return isExpanding ? [...otherExpandedHosts, host] : otherExpandedHosts;
    });

  // Page table params
  // Parse URL
  const {
    searchParam: urlSearchQuery = '',
    page: urlPage,
    per_page: urlPerPage,
    order: urlOrder,
  } = useUrlParams();

  // default
  const defaultParams = useMemo(
    () => ({
      page: urlPage ? Number(urlPage) : 1,
      per_page: urlPerPage ? Number(urlPerPage) : 20,
      order: urlOrder || '',
    }),
    [urlPage, urlPerPage, urlOrder]
  );

  // Page row for table
  const { pageRowCount } = getPageStats({
    total: apiResponse?.total || 0,
    page: apiResponse?.page || urlPage || 1,
    perPage: apiResponse?.per_page || urlPerPage || 0,
  });

  // Search filter
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

  // Call hosts data with params
  const makeApiCall = (requestParams, callParams = {}) => {
    dispatch(
      APIActions.get({
        key: callParams.key,
        url: callParams.url ?? `/api/job_invocations/${id}/hosts`,
        params: requestParams,
        handleSuccess: data => {
          if (callParams.key === ALL_JOB_HOSTS) {
            const ids = data.data.results.map(i => i.id);
            setAllHostsIds(ids);
          } else if (callParams.key === JOB_INVOCATION_HOSTS) {
            setApiResponse(data.data);
          }

          setStatus(STATUS_UPPERCASE.RESOLVED);
        },
        handleError: () => setStatus(STATUS_UPPERCASE.ERROR),
        errorToast: ({ response }) =>
          response?.data?.error?.full_messages?.[0] || response,
      })
    );
  };

  const filterApiCall = newAPIOptions => {
    const newParams = newAPIOptions?.params ?? newAPIOptions ?? {};

    const filterSearch = constructFilter(
      selectedFilter,
      newParams.search ?? urlSearchQuery
    );

    const finalParams = {
      ...defaultParams,
      ...newParams,
    };

    if (filterSearch !== '') {
      finalParams.search = filterSearch;
    }

    makeApiCall(finalParams, { key: JOB_INVOCATION_HOSTS });

    const urlSearchParams = new URLSearchParams(window.location.search);
    Object.entries(finalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlSearchParams.set(key, value);
      }
    });
    history.push({ search: urlSearchParams.toString() });
  };

  // Filter change
  const handleFilterChange = newFilter => {
    setSelectedFilter(newFilter);
    onFilterUpdate(newFilter);
  };

  // Effects
  // run after mount
  useEffect(() => {
    // load for bulk select
    makeApiCall({}, { key: ALL_JOB_HOSTS });

    // Job Invo template load
    makeApiCall(
      {},
      {
        url: `/job_invocations/${id}/hosts`,
        key: LIST_TEMPLATE_INVOCATIONS,
      }
    );

    if (selectedFilter === '') {
      setSelectedFilter('all_statuses');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFilter !== '') filterApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  const {
    updateSearchQuery: updateSearchQueryBulk,
    fetchBulkParams,
    inclusionSet,
    exclusionSet,
    ...selectAllOptions
  } = useBulkSelect({
    results: apiResponse?.results,
    metadata: {
      total: apiResponse?.total,
      page: apiResponse?.page,
      selectable: apiResponse?.subtotal,
    },
    initialSearchQuery: urlSearchQuery,
  });

  const {
    selectAll,
    selectPage,
    selectNone,
    selectedCount,
    selectOne,
    areAllRowsOnPageSelected,
    areAllRowsSelected,
    isSelected,
  } = selectAllOptions;

  const selectedIds =
    areAllRowsSelected() || exclusionSet.size > 0
      ? allHostsIds.filter(hostId => !exclusionSet.has(hostId))
      : Array.from(inclusionSet);

  const controller = 'hosts';
  const memoDefaultSearchProps = useMemo(
    () => getControllerSearchProps(controller),
    [controller]
  );
  memoDefaultSearchProps.autocomplete.url = foremanUrl(
    `/${controller}/auto_complete_search`
  );

  const combinedResponse = {
    response: {
      search: urlSearchQuery,
      can_create: false,
      results: apiResponse?.results || [],
      total: apiResponse?.total || 0,
      per_page: defaultParams?.perPage,
      page: defaultParams?.page,
      subtotal: apiResponse?.subtotal || 0,
      message: apiResponse?.message || 'error',
    },
    status,
    setAPIOptions: filterApiCall,
  };

  const results = apiResponse.results ?? [];

  const selectionToolbar = (
    <ToolbarItem key="selectAll">
      <SelectAllCheckbox
        {...{
          selectAll,
          selectPage,
          selectNone,
          selectedCount,
          pageRowCount,
        }}
        totalCount={apiResponse?.total}
        areAllRowsOnPageSelected={areAllRowsOnPageSelected()}
        areAllRowsSelected={areAllRowsSelected()}
      />
    </ToolbarItem>
  );

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

  return (
    <>
      <TableIndexPage
        apiUrl=""
        customSearchProps={memoDefaultSearchProps}
        controller="hosts"
        creatable={false}
        replacementResponse={combinedResponse}
        updateSearchQuery={updateSearchQueryBulk}
        customToolbarItems={[
          <DropdownFilter
            key="dropdown-filter"
            dropdownFilter={selectedFilter}
            setDropdownFilter={handleFilterChange}
          />,
          <CheckboxesActions
            bulkParams={selectedCount > 0 ? fetchBulkParams() : null}
            selectedIds={selectedIds}
            failedCount={failedCount}
            jobID={id}
            key="checkboxes-actions"
            filter={selectedFilter}
          />,
        ]}
        selectionToolbar={selectionToolbar}
      >
        <Table
          ouiaId="job-invocation-hosts-table"
          columns={columns}
          customEmptyState={
            status === STATUS_UPPERCASE.RESOLVED && !results.length
              ? customEmptyState
              : null
          }
          params={{ ...defaultParams }}
          setParams={filterApiCall}
          itemCount={apiResponse?.subtotal}
          results={results}
          url=""
          showCheckboxes
          refreshData={() => {}}
          errorMessage={
            status === STATUS_UPPERCASE.ERROR && apiResponse?.message
              ? apiResponse.message
              : null
          }
          isPending={status === STATUS_UPPERCASE.PENDING}
          isDeleteable={false}
          childrenOutsideTbody
        >
          {results.map((result, rowIndex) => (
            <Tbody key={result.id}>
              <Tr ouiaId={`table-row-${result.id}`}>
                <Td
                  expand={{
                    rowIndex,
                    isExpanded: isHostExpanded(result.id),
                    onToggle: () =>
                      setHostExpanded(result.id, !isHostExpanded(result.id)),
                    expandId: 'host-expandable',
                  }}
                />
                <RowSelectTd rowData={result} {...{ selectOne, isSelected }} />
                {columnNamesKeys.map(k => (
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
                  colSpan={columnNamesKeys.length + 3}
                >
                  <ExpandableRowContent>
                    {result.job_status === 'cancelled' ||
                    result.job_status === 'N/A' ? (
                      <div>
                        {__('A task for this host has not been started')}
                      </div>
                    ) : (
                      <TemplateInvocation
                        hostID={result.id}
                        jobID={id}
                        isInTableView
                        isExpanded={isHostExpanded(result.id)}
                      />
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
  failedCount: PropTypes.number.isRequired,
  initialFilter: PropTypes.string.isRequired,
  onFilterUpdate: PropTypes.func,
};

JobInvocationHostTable.defaultProps = {
  onFilterUpdate: () => {},
};

export default JobInvocationHostTable;
