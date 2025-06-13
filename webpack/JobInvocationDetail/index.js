import {
  Divider,
  Flex,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';
import { stopInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { JobAdditionInfo } from './JobAdditionInfo';
import { getJobInvocation, getTask } from './JobInvocationActions';
import {
  CURRENT_PERMISSIONS,
  currentPermissionsUrl,
  DATE_OPTIONS,
  JOB_INVOCATION_KEY,
  STATUS,
} from './JobInvocationConstants';
import JobInvocationHostTable from './JobInvocationHostTable';
import JobInvocationOverview from './JobInvocationOverview';
import { selectItems } from './JobInvocationSelectors';
import JobInvocationSystemStatusChart from './JobInvocationSystemStatusChart';
import JobInvocationToolbarButtons from './JobInvocationToolbarButtons';

import './JobInvocationDetail.scss';

const JobInvocationDetailPage = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const {
    description,
    status_label: statusLabel,
    task,
    start_at: startAt,
    targeting,
  } = items;
  const finished =
    statusLabel === STATUS.FAILED ||
    statusLabel === STATUS.SUCCEEDED ||
    statusLabel === STATUS.CANCELLED;
  const autoRefresh = task?.state === STATUS.PENDING || false;
  const { response, status } = useAPI(
    'get',
    currentPermissionsUrl,
    CURRENT_PERMISSIONS
  );
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = newFilter => {
    setSelectedFilter(newFilter);
  };

  let isAlreadyStarted = false;
  let formattedStartDate;
  if (startAt) {
    // eslint-disable-next-line camelcase
    isAlreadyStarted = !!task?.started_at;
    formattedStartDate = new Date(startAt).toLocaleString(
      documentLocale(),
      DATE_OPTIONS
    );
  }

  useEffect(() => {
    dispatch(getJobInvocation(`/api/job_invocations/${id}?host_status=true`));
    if (finished && !autoRefresh) {
      dispatch(stopInterval(JOB_INVOCATION_KEY));
    }
    return () => {
      dispatch(stopInterval(JOB_INVOCATION_KEY));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, finished, autoRefresh]);

  useEffect(() => {
    if (task?.id !== undefined) {
      dispatch(getTask(`${task?.id}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, task?.id]);

  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: description },
    ],
    isPf4: true,
  };

  return (
    <>
      <PageLayout
        header={description}
        breadcrumbOptions={breadcrumbOptions}
        toolbarButtons={
          <JobInvocationToolbarButtons
            jobId={id}
            data={items}
            currentPermissions={response.results}
            permissionsStatus={status}
          />
        }
        searchable={false}
      >
        <Flex
          className="job-invocation-detail-flex"
          alignItems={{ default: 'alignItemsFlexStart' }}
        >
          <JobInvocationSystemStatusChart
            data={items}
            isAlreadyStarted={isAlreadyStarted}
            formattedStartDate={formattedStartDate}
            onFilterChange={handleFilterChange}
          />
          <Divider
            orientation={{
              default: 'vertical',
            }}
          />
          <Flex
            className="job-overview"
            alignItems={{ default: 'alignItemsCenter' }}
          >
            <JobInvocationOverview
              data={items}
              isAlreadyStarted={isAlreadyStarted}
              formattedStartDate={formattedStartDate}
              onFilterChange={handleFilterChange}
            />
          </Flex>
        </Flex>
        <PageSection
          variant={PageSectionVariants.light}
          className="job-additional-info"
        >
          {items.id !== undefined && <JobAdditionInfo data={items} />}
        </PageSection>
      </PageLayout>
      <PageSection
        variant={PageSectionVariants.light}
        className="job-details-table-section table-section"
      >
        {items.id !== undefined && (
          <JobInvocationHostTable
            id={id}
            targeting={targeting}
            finished={finished}
            autoRefresh={autoRefresh}
            initialFilter={selectedFilter}
            onFilterUpdate={handleFilterChange}
          />
        )}
      </PageSection>
    </>
  );
};

JobInvocationDetailPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default JobInvocationDetailPage;
