import {
  Divider,
  Flex,
  PageSection,
  PageSectionVariants,
  Skeleton,
} from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';
import { useDispatch, useSelector } from 'react-redux';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import PropTypes from 'prop-types';
import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';
import { stopInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';

import { JobAdditionInfo } from './JobAdditionInfo';
import JobInvocationHostTable from './JobInvocationHostTable';
import JobInvocationOverview from './JobInvocationOverview';
import JobInvocationSystemStatusChart from './JobInvocationSystemStatusChart';
import JobInvocationToolbarButtons from './JobInvocationToolbarButtons';
import { getJobInvocation, getTask } from './JobInvocationActions';
import './JobInvocationDetail.scss';
import {
  CURRENT_PERMISSIONS,
  DATE_OPTIONS,
  JOB_INVOCATION_KEY,
  STATUS,
  STATUS_UPPERCASE,
  currentPermissionsUrl,
} from './JobInvocationConstants';
import { selectItems } from './JobInvocationSelectors';

const JobInvocationDetailPage = ({
  match: {
    params: { id },
  },
  history,
}) => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const {
    description,
    status_label: statusLabel,
    task,
    start_at: startAt,
    targeting = {},
  } = items;
  const finished =
    statusLabel === STATUS.FAILED ||
    statusLabel === STATUS.SUCCEEDED ||
    statusLabel === STATUS.CANCELLED;
  const autoRefresh = task?.state === STATUS.PENDING || false;
  useAPI('get', currentPermissionsUrl, {
    key: CURRENT_PERMISSIONS,
  });
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

  const pageStatus =
    items.id === undefined
      ? STATUS_UPPERCASE.PENDING
      : STATUS_UPPERCASE.RESOLVED;

  const breadcrumbOptions = {
    isSwitchable: true,
    onSwitcherItemClick: (e, href) => {
      e.preventDefault();
      history.push(href);
    },
    resource: {
      nameField: 'description',
      resourceUrl: '/api/v2/job_invocations',
      switcherItemUrl: '/job_invocations/:id',
    },
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      {
        caption:
          pageStatus === STATUS_UPPERCASE.PENDING ? (
            <Skeleton width="350px" />
          ) : (
            description
          ),
      },
    ],
    isPf4: true,
  };

  return (
    <>
      <PageLayout
        header={description}
        breadcrumbOptions={breadcrumbOptions}
        toolbarButtons={<JobInvocationToolbarButtons jobId={id} data={items} />}
        searchable={false}
      >
        <Flex className="job-invocation-detail-flex">
          <SkeletonLoader
            status={pageStatus}
            skeletonProps={{
              height: 105,
              width: 375,
            }}
          >
            <JobInvocationSystemStatusChart
              data={items}
              isAlreadyStarted={isAlreadyStarted}
              formattedStartDate={formattedStartDate}
              onFilterChange={handleFilterChange}
            />
          </SkeletonLoader>
          <Divider
            orientation={{
              default: 'vertical',
            }}
          />
          <SkeletonLoader
            status={pageStatus}
            skeletonProps={{
              height: 105,
              width: 270,
            }}
          >
            <JobInvocationOverview
              data={items}
              isAlreadyStarted={isAlreadyStarted}
              formattedStartDate={formattedStartDate}
            />
          </SkeletonLoader>
        </Flex>
        <PageSection
          variant={PageSectionVariants.light}
          className="job-additional-info"
        >
          <SkeletonLoader
            status={pageStatus}
            skeletonProps={{ height: 150, width: '100%' }}
          >
            <JobAdditionInfo data={items} />
          </SkeletonLoader>
        </PageSection>
      </PageLayout>
      <PageSection
        variant={PageSectionVariants.light}
        className="job-details-table-section table-section"
      >
        <SkeletonLoader
          status={pageStatus}
          skeletonProps={{ height: 400, width: '100%' }}
        >
          <JobInvocationHostTable
            id={id}
            targeting={targeting}
            finished={finished}
            autoRefresh={autoRefresh}
            initialFilter={selectedFilter}
            statusLabel={statusLabel}
            onFilterUpdate={handleFilterChange}
          />
        </SkeletonLoader>
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
  history: PropTypes.object.isRequired,
};

export default JobInvocationDetailPage;
