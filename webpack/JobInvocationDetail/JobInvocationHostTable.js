import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Tr, Td } from '@patternfly/react-table';
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
import JobStatusIcon from '../react_app/components/RecentJobsCard/JobStatusIcon';
import {
  columns,
  JOB_INVOCATION_HOSTS,
  STATUS,
} from './JobInvocationConstants';

const JobInvocationHostTable = ({ data }) => {
  const { id } = data;
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
        params={params}
        setParams={setParamsAndAPI}
        itemCount={response?.subtotal}
        results={response?.results}
        url=""
        refreshData={() => {}}
        errorMessage={
          status === STATUS.ERROR && response?.message ? response.message : null
        }
        isPending={status === STATUS.PENDING || response?.results === undefined}
        isDeleteable={false}
      >
        {response?.results?.map((result, rowIndex) => (
          <Tr key={rowIndex} ouiaId={`table-row-${rowIndex}`}>
            {columnNamesKeys.map(k => (
              <Td key={k}>
                {k === 'status' ? (
                  <JobStatusIcon status={columns[k].status(result.job_status)}>
                    {columns[k].tableTitle(result.job_status)}
                  </JobStatusIcon>
                ) : (
                  columns[k].wrapper(result)
                )}
              </Td>
            ))}
          </Tr>
        ))}
      </Table>
    </TableIndexPage>
  );
};

JobInvocationHostTable.propTypes = {
  data: PropTypes.object.isRequired,
};

JobInvocationHostTable.defaultProps = {};

export default JobInvocationHostTable;
