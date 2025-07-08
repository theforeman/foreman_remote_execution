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
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
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
import URI from 'urijs';
import { CheckboxesActions } from './CheckboxesActions';
import DropdownFilter from './DropdownFilter';
import Columns, {
  JOB_INVOCATION_HOSTS,
  MAX_HOSTS_API_SIZE,
  STATUS_UPPERCASE,
} from './JobInvocationConstants';
import { PopupAlert } from './OpenAllInvocationsModal';
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
  const apiOptions = { key: JOB_INVOCATION_HOSTS };
  const history = useHistory();
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [expandedHost, setExpandedHost] = useState([]);

  useEffect(() => {
    if (initialFilter !== selectedFilter) {
      wrapSetSelectedFilter(initialFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilter]);

  const {
    searchParam: urlSearchQuery = '',
    page: urlPage,
    per_page: urlPerPage,
    order: urlOrder,
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

  const defaultParams = useMemo(() => {
    const search = constructFilter(selectedFilter, urlSearchQuery);
    return {
      ...(search ? { search } : {}),
      ...(urlPage ? { page: Number(urlPage) } : {}),
      ...(urlPerPage ? { per_page: Number(urlPerPage) } : {}),
      ...(urlOrder ? { order: urlOrder } : {}),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, urlSearchQuery, urlPage, urlPerPage, urlOrder]);

  const { response, status, setAPIOptions } = useAPI(
    'get',
    `/api/job_invocations/${id}/hosts`,
    {
      params: defaultParams,
    }
  );

  const [allPagesResponse, setAllPagesResponse] = useState([]);
  const apiAllParams = {
    page: 1,
    per_page: Math.min(response?.subtotal || 1, MAX_HOSTS_API_SIZE),
    search: constructFilter(selectedFilter, urlSearchQuery),
  };

  const { response: allResponse, setAPIOptions: setAllAPIOptions } = useAPI(
    'get',
    `/api/job_invocations/${id}/hosts`,
    {
      params: apiAllParams,
    }
  );

  useEffect(() => {
    if (response?.subtotal) {
      setAllAPIOptions(prevOptions => ({
        ...prevOptions,
        params: apiAllParams,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.subtotal, selectedFilter, urlSearchQuery]);

  useEffect(() => {
    if (allResponse?.results) {
      setAllPagesResponse(allResponse.results);
    }
  }, [allResponse]);

  const {
    updateSearchQuery: updateSearchQueryBulk,
    inclusionSet,
    exclusionSet,
    ...selectAllOptions
  } = useBulkSelect({
    results: response?.results,
    metadata: {
      total: response?.total,
      page: response?.page,
      selectable: response?.subtotal,
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

  const allHostIds = allPagesResponse?.map(item => item.id) || [];
  const selectedIds =
    areAllRowsSelected() || exclusionSet.size > 0
      ? allHostIds.filter(hostId => !exclusionSet.has(hostId))
      : Array.from(inclusionSet);

  const { pageRowCount } = getPageStats({
    total: response?.total || 0,
    page: response?.page || urlPage || 1,
    perPage: response?.per_page || urlPerPage || 0,
  });

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
        totalCount={response?.total}
        areAllRowsOnPageSelected={areAllRowsOnPageSelected()}
        areAllRowsSelected={areAllRowsSelected()}
      />
    </ToolbarItem>
  );

  const controller = 'hosts';
  const memoDefaultSearchProps = useMemo(
    () => getControllerSearchProps(controller),
    [controller]
  );
  memoDefaultSearchProps.autocomplete.url = foremanUrl(
    `/${controller}/auto_complete_search`
  );

  const wrapSetSelectedFilter = newFilter => {
    setSelectedFilter(newFilter);
    onFilterUpdate(newFilter);

    const newParams = {
      ...defaultParams,
      page: 1,
      search: constructFilter(newFilter, urlSearchQuery),
    };
    setAPIOptions(prev => ({ ...prev, params: newParams }));

    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set('page', '1');
    history.push({ search: urlSearchParams.toString() });
  };

  const wrapSetAPIOptions = newAPIOptions => {
    const newParams = newAPIOptions?.params ?? newAPIOptions ?? {};

    const mergedParams = {
      ...defaultParams,
      ...newParams,
      search: constructFilter(
        selectedFilter,
        newParams.search ?? urlSearchQuery
      ),
    };

    setAPIOptions(prev => ({ ...prev, params: mergedParams }));

    const { search: _search, ...paramsForUrl } = mergedParams;
    const uri = new URI();
    uri.setSearch(paramsForUrl);
    history.push({ search: uri.search() });
  };

  const combinedResponse = {
    response: {
      search: urlSearchQuery,
      can_create: false,
      results: response?.results || [],
      total: response?.total || 0,
      per_page: defaultParams?.perPage,
      page: defaultParams?.page,
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
        updateSearchQuery={updateSearchQueryBulk}
        customToolbarItems={[
          <DropdownFilter
            key="dropdown-filter"
            dropdownFilter={selectedFilter}
            setDropdownFilter={wrapSetSelectedFilter}
          />,
          <CheckboxesActions
            selectedIds={selectedIds}
            failedCount={failedCount}
            jobID={id}
            key="checkboxes-actions"
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
          params={{
            page: response?.page || Number(urlPage),
            per_page: response?.per_page || Number(urlPerPage),
            order: urlOrder,
          }}
          page={response?.page || Number(urlPage)}
          perPage={response?.per_page || Number(urlPerPage)}
          setParams={wrapSetAPIOptions}
          itemCount={response?.subtotal}
          results={results}
          url=""
          showCheckboxes
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
  failedCount: PropTypes.number.isRequired,
  initialFilter: PropTypes.string.isRequired,
  onFilterUpdate: PropTypes.func,
};

JobInvocationHostTable.defaultProps = {
  onFilterUpdate: () => {},
};

export default JobInvocationHostTable;
