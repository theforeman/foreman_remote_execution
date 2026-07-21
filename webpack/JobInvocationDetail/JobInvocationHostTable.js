/* eslint-disable max-lines */
/* eslint-disable camelcase */
import {
  Icon,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateVariant,
  ToolbarItem,
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
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
import PropTypes from 'prop-types';
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import { CheckboxesActions } from './CheckboxesActions';
import DropdownFilter from './DropdownFilter';
import Columns, {
  JOB_INVOCATION_HOSTS,
  STATUS_UPPERCASE,
  AWAITING_STATUS_FILTER,
  AUTO_REFRESH_INTERVAL_MS,
} from './JobInvocationConstants';
import { TemplateInvocation } from './TemplateInvocation';
import { RowActions } from './TemplateInvocationComponents/TemplateActionButtons';
import { PopupAlert } from './OpenAllInvocationsModal';

const JobInvocationHostTable = ({
  id,
  initialFilter,
  jobFinished,
  onFilterUpdate,
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
  const [expandedHost, setExpandedHost] = useState(new Set());
  const prevJobFinished = useRef(jobFinished);
  const prevFilter = useRef('');
  const prevId = useRef(id);
  const pollTimeoutId = useRef(null);
  const currentPollParams = useRef({});
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const jobFinishedRef = useRef(jobFinished);
  useEffect(() => {
    jobFinishedRef.current = jobFinished;
  }, [jobFinished]);

  const [hostInvocationStates, setHostInvocationStates] = useState({});

  const getInvocationState = hostId =>
    hostInvocationStates[hostId] || {
      showOutputType: { stderr: true, stdout: true, debug: true },
      showTemplatePreview: false,
      showCommand: false,
    };

  const updateInvocationState = (hostId, stateKey, value) => {
    setHostInvocationStates(prevStates => {
      const currentHostState = getInvocationState(hostId);

      const newValue =
        typeof value === 'function' ? value(currentHostState[stateKey]) : value;

      return {
        ...prevStates,
        [hostId]: {
          ...currentHostState,
          [stateKey]: newValue,
        },
      };
    });
  };

  const isHostExpanded = hostId => expandedHost.has(hostId);
  const setHostExpanded = (hostId, isExpanding = true) =>
    setExpandedHost(prevExpandedSet => {
      const newSet = new Set(prevExpandedSet);
      if (isExpanding) {
        newSet.add(hostId);
      } else {
        newSet.delete(hostId);
      }
      return newSet;
    });

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
  const constructFilter = useCallback(
    (filter = initialFilter, search = urlSearchQuery) => {
      const dropdownFilterClause =
        filter && filter !== 'all_statuses'
          ? `job_invocation.result = ${filter}`
          : null;
      const parts = [dropdownFilterClause, search];
      return parts
        .filter(x => x)
        .map(fragment => `(${fragment})`)
        .join(' AND ');
    },
    [initialFilter, urlSearchQuery]
  );

  const [hostPermissions, setHostPermissions] = useState({});

  const updateHostsState = useCallback(data => {
    const ids = data.data.results.map(i => i.id);
    setApiResponse(data.data);
    setAllHostsIds(ids);
    setStatus(STATUS_UPPERCASE.RESOLVED);

    const resultsWithPermissions = data.data.results.filter(r => r.permissions);
    if (resultsWithPermissions.length > 0) {
      setHostPermissions(prev => {
        const updated = { ...prev };
        resultsWithPermissions.forEach(r => {
          updated[r.id] = { task: r.task, permissions: r.permissions };
        });
        return updated;
      });
    }
  }, []);

  // Call hosts data with params
  const makeApiCall = useCallback(
    requestParams => {
      requestIdRef.current += 1;
      const thisRequest = requestIdRef.current;
      dispatch(
        APIActions.get({
          key: JOB_INVOCATION_HOSTS,
          url: `/api/job_invocations/${id}/hosts`,
          params: requestParams,
          handleSuccess: data => {
            if (thisRequest !== requestIdRef.current) return;
            if (!mountedRef.current) return;
            updateHostsState(data);
            if (!jobFinishedRef.current) {
              pollTimeoutId.current = setTimeout(
                () => makeApiCall(currentPollParams.current),
                AUTO_REFRESH_INTERVAL_MS
              );
            } else {
              pollTimeoutId.current = null;
            }
          },
          handleError: () => {
            if (thisRequest !== requestIdRef.current) return;
            if (!mountedRef.current) return;
            pollTimeoutId.current = null;
            setStatus(STATUS_UPPERCASE.ERROR);
          },
          errorToast: ({ response }) =>
            response?.data?.error?.full_messages?.[0] ||
            response?.data?.error?.message ||
            __('Failed to load host invocation data'),
        })
      );
    },
    [dispatch, id, updateHostsState]
  );

  const filterApiCall = useCallback(
    newAPIOptions => {
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

      finalParams.include_permissions = true;

      currentPollParams.current = { ...finalParams };
      delete currentPollParams.current.include_permissions;
      clearTimeout(pollTimeoutId.current);
      pollTimeoutId.current = null;

      makeApiCall(finalParams);

      const urlSearchParams = new URLSearchParams(window.location.search);

      ['page', 'per_page', 'order'].forEach(key => {
        if (finalParams[key]) urlSearchParams.set(key, finalParams[key]);
      });

      history.push({ search: urlSearchParams.toString() });
    },
    [
      initialFilter,
      urlSearchQuery,
      defaultParams,
      makeApiCall,
      history,
      constructFilter,
    ]
  );

  // Effects
  // run after mount
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      if (initialFilter === '') {
        onFilterUpdate('all_statuses');
      }
      initializedRef.current = true;
    }
  }, [initialFilter, onFilterUpdate]);

  useEffect(() => {
    const filterChanged = initialFilter !== prevFilter.current;
    const statusChanged = jobFinished !== prevJobFinished.current;
    const idChanged = id !== prevId.current;

    if ((filterChanged || statusChanged || idChanged) && initialFilter !== '') {
      prevFilter.current = initialFilter;
      prevJobFinished.current = jobFinished;
      prevId.current = id;
      filterApiCall();
    }
  }, [initialFilter, jobFinished, id, filterApiCall]);

  useEffect(
    () => () => {
      mountedRef.current = false;
      clearTimeout(pollTimeoutId.current);
    },
    []
  );

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
            <Icon size="xl" iconSize="xl">
              <AddCircleOIcon name="add-circle-o" />
            </Icon>
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

  const pageHostIds = results.map(h => h.id);

  const areAllPageRowsExpanded =
    pageHostIds.length > 0 &&
    pageHostIds.every(hostId => expandedHost.has(hostId));

  const onExpandAll = () => {
    setExpandedHost(() => {
      if (areAllPageRowsExpanded) {
        return new Set();
      }
      return new Set(pageHostIds);
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
            setDropdownFilter={onFilterUpdate}
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
          {results.map((result, rowIndex) => {
            const currentInvocationState = getInvocationState(result.id);
            return (
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
                  <RowSelectTd
                    rowData={result}
                    selectOne={selectOne}
                    isSelected={isSelected}
                  />
                  {columnNamesKeys.map(k => (
                    <Td key={k}>{columns[k].wrapper(result)}</Td>
                  ))}
                  <Td isActionCell>
                    <RowActions
                      hostID={result.id}
                      jobID={id}
                      task={hostPermissions[result.id]?.task}
                      permissions={hostPermissions[result.id]?.permissions}
                    />
                  </Td>
                </Tr>
                <Tr
                  isExpanded={isHostExpanded(result.id)}
                  ouiaId="table-row-expanded-sections"
                  className={!isHostExpanded(result.id) ? 'row-hidden' : ''}
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
                          key={result.id}
                          hostID={result.id}
                          jobID={id}
                          isInTableView
                          isExpanded={isHostExpanded(result.id)}
                          showOutputType={currentInvocationState.showOutputType}
                          showTemplatePreview={
                            currentInvocationState.showTemplatePreview
                          }
                          showCommand={currentInvocationState.showCommand}
                          setShowOutputType={value =>
                            updateInvocationState(
                              result.id,
                              'showOutputType',
                              value
                            )
                          }
                          setShowTemplatePreview={value =>
                            updateInvocationState(
                              result.id,
                              'showTemplatePreview',
                              value
                            )
                          }
                          setShowCommand={value =>
                            updateInvocationState(
                              result.id,
                              'showCommand',
                              value
                            )
                          }
                        />
                      )}
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
        </Table>
      </TableIndexPage>
    </>
  );
};

JobInvocationHostTable.propTypes = {
  id: PropTypes.string.isRequired,
  targeting: PropTypes.object.isRequired,
  initialFilter: PropTypes.string.isRequired,
  jobFinished: PropTypes.bool,
  onFilterUpdate: PropTypes.func,
};

JobInvocationHostTable.defaultProps = {
  onFilterUpdate: () => {},
  jobFinished: false,
};

export default JobInvocationHostTable;
