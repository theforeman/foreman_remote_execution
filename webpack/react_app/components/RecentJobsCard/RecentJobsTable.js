import PropTypes from 'prop-types';
import React from 'react';
import { Text, Bullseye } from '@patternfly/react-core';
import { TableComposable, Tr, Tbody, Td } from '@patternfly/react-table';
import { STATUS } from 'foremanReact/constants';

import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';

import JobStatusIcon from './JobStatusIcon';
import { JOB_API_URL, JOBS_IN_CARD, RECENT_JOBS_KEY } from './constants';

const RecentJobsTable = ({ status, hostId }) => {
  const jobsUrl =
    hostId &&
    foremanUrl(
      `${JOB_API_URL}${hostId}&status=${status}&limit=${JOBS_IN_CARD}`
    );
  const {
    response: { job_invocations: jobs },
    status: responseStatus,
  } = useAPI('get', jobsUrl, RECENT_JOBS_KEY);

  return (
    <SkeletonLoader
      skeletonProps={{ count: 3 }}
      status={responseStatus || STATUS.PENDING}
      emptyState={
        <Bullseye>
          <Text
            ouiaId="no-results-text"
            style={{ marginTop: '20px' }}
            component="p"
          >
            {__('No results found')}
          </Text>
        </Bullseye>
      }
    >
      {!!jobs?.length && (
        <TableComposable
          aria-label="recent-jobs-table"
          variant="compact"
          borders="compactBorderless"
        >
          <Tbody>
            {jobs.map(
              ({
                status: jobStatus,
                status_label: label,
                id,
                start_at: startAt,
                description,
              }) => (
                <Tr key={id}>
                  <Td modifier="truncate" key={`name-${id}`}>
                    <a href={foremanUrl(`/job_invocations/${id}`)}>
                      {description}
                    </a>
                  </Td>
                  <Td modifier="truncate" key={`date-${id}`}>
                    <RelativeDateTime date={startAt} />
                  </Td>
                  <Td modifier="truncate" key={`status-${id}`}>
                    <JobStatusIcon status={jobStatus}>{label}</JobStatusIcon>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </TableComposable>
      )}
    </SkeletonLoader>
  );
};

RecentJobsTable.propTypes = {
  hostId: PropTypes.number,
  status: PropTypes.string,
};

RecentJobsTable.defaultProps = {
  hostId: undefined,
  status: STATUS.PENDING,
};

export default RecentJobsTable;
