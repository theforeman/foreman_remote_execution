/* eslint-disable max-lines */
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, { useMemo, useEffect, useState } from 'react';
import { Icon } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import { FormattedMessage } from 'react-intl';
import { Tr, Td, Tbody, ExpandableRowContent } from '@patternfly/react-table';
import {
  ToolbarItem,
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
import { RowSelectTd } from 'foremanReact/components/HostsIndex/RowSelectTd';
import { getControllerSearchProps } from 'foremanReact/constants';
import SelectAllCheckbox from 'foremanReact/components/PF4/TableIndexPage/Table/SelectAllCheckbox';
import { getPageStats } from 'foremanReact/components/PF4/TableIndexPage/Table/helpers';
import Columns, {
  JOB_INVOCATION_HOSTS,
  STATUS_UPPERCASE,
} from './JobInvocationConstants';
import { TemplateInvocation } from './TemplateInvocation';
import { OpenAlInvocations, PopupAlert } from './OpenAlInvocations';
import { RowActions } from './TemplateInvocationComponents/TemplateActionButtons';
import { CheckboxesActions } from './CheckboxesActions';

const JobInvocationHostTable = ({
  id,
  targeting,
  finished,
  autoRefresh,
  initialFilter,
  currentPermissions,
  permissionsStatus,
}) => {
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
  const [expandedHost, setExpandedHost] = useState([]);
  const { response, status, setAPIOptions } = useAPI(
    'get',
    `/api/job_invocations/${id}/hosts`,
    {
      params: {
        ...defaultParams,
      },
      key: JOB_INVOCATION_HOSTS,
      handleSuccess: ({ data }) => {
        if (data?.results?.length === 1) setExpandedHost([data.results[0].id]);
      },
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

  const {
    updateSearchQuery: updateSearchQueryBulk,
    fetchBulkParams,
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

  const bulkParams = selectedCount ? fetchBulkParams() : null;
  const controller = 'hosts';
  const memoDefaultSearchProps = useMemo(
    () => getControllerSearchProps(controller),
    [controller]
  );
  memoDefaultSearchProps.autocomplete.url = foremanUrl(
    `/${controller}/auto_complete_search`
  );

  const failedHosts = useMemo(
    () =>
      response?.results
        ?.filter(host => host.job_status === 'error')
        ?.map(host => host.id) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [response?.results]
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

  const { pageRowCount } = getPageStats({
    total: response?.total || 0,
    page: response?.page || urlPage || 1,
    perPage: response?.perPage || urlPerPage || 20,
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
        customToolbarItems={[
          <OpenAlInvocations
            setShowAlert={setShowAlert}
            results={results}
            id={id}
          />,
          <CheckboxesActions
            jobID={id}
            bulkParams={bulkParams}
            failedHosts={failedHosts}
            selectedCount={selectedCount}
            currentPermissions={currentPermissions}
            permissionsStatus={permissionsStatus}
          />,
        ]}
        controller="hosts"
        creatable={false}
        replacementResponse={combinedResponse}
        selectionToolbar={selectionToolbar}
        updateSearchQuery={updateSearchQueryBulk}
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
          showCheckboxes
          refreshData={() => {}}
          errorMessage={
            status === STATUS_UPPERCASE.ERROR && response?.message
              ? response.message
              : null
          }
          isPending={status === STATUS_UPPERCASE.PENDING}
          isDeleteable={false}
          bottomPagination={bottomPagination}
          childrenOutsideTbody
        >
          {response?.results?.map((result, rowIndex) => (
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
                {
                  <RowSelectTd
                    rowData={result}
                    {...{ selectOne, isSelected }}
                  />
                }
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
  currentPermissions: PropTypes.array,
  permissionsStatus: PropTypes.string,
};

JobInvocationHostTable.defaultProps = {
  currentPermissions: undefined,
  permissionsStatus: undefined,
};

export default JobInvocationHostTable;
