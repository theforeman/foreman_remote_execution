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
import { RowSelectTd } from 'foremanReact/components/PF4/TableIndexPage/RowSelectTd';
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
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import { CheckboxesActions } from './CheckboxesActions';
import DropdownFilter from './DropdownFilter';
import Columns, {
  JOB_INVOCATION_HOSTS,
  LIST_TEMPLATE_INVOCATIONS,
  STATUS_UPPERCASE,
  ALL_JOB_HOSTS,
  AWAITING_STATUS_FILTER,
} from './JobInvocationConstants';
import { TemplateInvocation } from './TemplateInvocation';
import { RowActions } from './TemplateInvocationComponents/TemplateActionButtons';
import { PopupAlert } from './OpenAllInvocationsModal';

const JobInvocationHostTable = ({
  id,
  initialFilter,
  onFilterUpdate,
  statusLabel,
  targeting,
}) => {
  const columns = Columns();
  const columnNamesKeys = Object.keys(columns);

  const history = useHistory();
  const dispatch = useDispatch();

  const [showAlert, setShowAlert] = useState(false);

  const [apiResponse, setApiResponse] = useState([]);
  const [status, setStatus] = useState(STATUS_UPPERCASE.PENDING);
  const [allHostsIds, setAllHostsIds] = useState([]);

  // Expansive items
  const [expandedHost, setExpandedHost] = useState([]);
  const prevStatusLabel = useRef(statusLabel);

  // Page table params
  // Parse URL
  const {
    searchParam: urlSearchQuery = '',
    page: urlPage,
    per_page: urlPerPage,
    order: urlOrder,
  } = useUrlParams();

  const { perPage: foremanPerPage } = useForemanSettings();

  // default
  const defaultParams = useMemo(
    () => ({
      page: urlPage ? Number(urlPage) : 1,
      per_page: urlPerPage || Number(urlPerPage) || foremanPerPage,
      order: urlOrder || '',
    }),
    [urlPage, urlPerPage, foremanPerPage, urlOrder]
  );

  // Page row for table
  const { pageRowCount } = getPageStats({
    total: apiResponse?.total || 0,
    page: apiResponse?.page || urlPage || 1,
    perPage: apiResponse?.per_page || urlPerPage || 0,
  });

  // Search filter
  const constructFilter = (filter = initialFilter, search = urlSearchQuery) => {
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

  const handleResponse = (data, key) => {
    if (key === JOB_INVOCATION_HOSTS) {
      const ids = data.data.results.map(i => i.id);

      setApiResponse(data.data);
      setAllHostsIds(ids);
    }

    setStatus(STATUS_UPPERCASE.RESOLVED);
  };

  // Call hosts data with params
  const makeApiCall = (requestParams, callParams = {}) => {
    dispatch(
      APIActions.get({
        key: callParams.key ?? ALL_JOB_HOSTS,
        url: callParams.url ?? `/api/job_invocations/${id}/hosts`,
        params: requestParams,
        handleSuccess: data => handleResponse(data, callParams.key),
        handleError: () => setStatus(STATUS_UPPERCASE.ERROR),
        errorToast: ({ response }) =>
          response?.data?.error?.full_messages?.[0] || response,
      })
    );
  };

  const filterApiCall = newAPIOptions => {
    const newParams = newAPIOptions?.params ?? newAPIOptions ?? {};

    const filterSearch = constructFilter(
      initialFilter,
      newParams.search ?? urlSearchQuery
    );

    const finalParams = {
      ...defaultParams,
      ...newParams,
    };

    if (filterSearch === AWAITING_STATUS_FILTER) {
      finalParams.awaiting = 'true';
    } else if (filterSearch !== '') {
      finalParams.search = filterSearch;
    }

    makeApiCall(finalParams, { key: JOB_INVOCATION_HOSTS });

    const urlSearchParams = new URLSearchParams(window.location.search);

    ['page', 'per_page', 'order'].forEach(key => {
      if (finalParams[key]) urlSearchParams.set(key, finalParams[key]);
    });

    history.push({ search: urlSearchParams.toString() });
  };

  // Filter change
  const handleFilterChange = newFilter => {
    onFilterUpdate(newFilter);
  };

  // Effects
  // run after mount
  useEffect(() => {
    // Job Invo template load
    makeApiCall(
      {},
      {
        url: `/job_invocations/${id}/hosts`,
        key: LIST_TEMPLATE_INVOCATIONS,
      }
    );

    if (initialFilter === '') {
      onFilterUpdate('all_statuses');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialFilter !== '') filterApiCall();

    if (statusLabel !== prevStatusLabel.current) {
      prevStatusLabel.current = statusLabel;
      filterApiCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilter, statusLabel, id]);

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

  const isHostExpanded = host => expandedHost.includes(host.id);

  const setHostExpanded = (host, isExpanding = true) =>
    setExpandedHost(prevExpanded => {
      const otherExpandedHosts = prevExpanded.filter(h => h !== host.id);
      return isExpanding
        ? [...otherExpandedHosts, host.id]
        : otherExpandedHosts;
    });

  const pageHostIds = results.map(h => h.id);

  const areAllPageRowsExpanded =
    pageHostIds.length > 0 &&
    pageHostIds.every(hostId => expandedHost.includes(hostId));

  const onExpandAll = () => {
    setExpandedHost(() => {
      if (areAllPageRowsExpanded) {
        return [];
      }

      return pageHostIds;
    });
  };

  return (
    <>
      {showAlert && <PopupAlert setShowAlert={setShowAlert} />}
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
            dropdownFilter={initialFilter}
            setDropdownFilter={handleFilterChange}
          />,
          <CheckboxesActions
            bulkParams={selectedCount > 0 ? fetchBulkParams() : null}
            selectedIds={selectedIds}
            allJobs={results}
            jobID={id}
            key="checkboxes-actions"
            filter={initialFilter}
            setShowAlert={setShowAlert}
          />,
        ]}
        selectionToolbar={selectionToolbar}
      >
        <Table
          ouiaId="job-invocation-hosts-table"
          columns={columns}
          areAllRowsExpanded={!areAllPageRowsExpanded}
          onExpandAll={onExpandAll}
          customEmptyState={
            status === STATUS_UPPERCASE.RESOLVED && !results.length
              ? customEmptyState
              : null
          }
          params={{
            page: defaultParams.page || Number(urlPage),
            per_page: defaultParams.per_page || Number(urlPerPage),
            order: urlOrder,
          }}
          page={defaultParams.page || Number(urlPage)}
          perPage={defaultParams.per_page || Number(urlPerPage)}
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
            <Tbody key={result.id} isExpanded={isHostExpanded(result)}>
              <Tr ouiaId={`table-row-${result.id}`}>
                <Td
                  expand={{
                    rowIndex,
                    isExpanded: isHostExpanded(result),
                    onToggle: () =>
                      setHostExpanded(result, !isHostExpanded(result)),
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
                isExpanded={isHostExpanded(result)}
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
                        key={`${result.id}-${result.job_status}`}
                        hostID={result.id}
                        jobID={id}
                        isInTableView
                        isExpanded={isHostExpanded(result)}
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
  initialFilter: PropTypes.string.isRequired,
  statusLabel: PropTypes.string,
  onFilterUpdate: PropTypes.func,
};

JobInvocationHostTable.defaultProps = {
  onFilterUpdate: () => {},
  statusLabel: undefined,
};

export default JobInvocationHostTable;
