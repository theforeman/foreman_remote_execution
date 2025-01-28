import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider,
  Flex,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { stopInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { getJobInvocation, getTask } from './JobInvocationActions';
import {
  CURRENT_PERMISSIONS,
  DATE_OPTIONS,
  JOB_INVOCATION_KEY,
  STATUS,
  currentPermissionsUrl,
} from './JobInvocationConstants';
import './JobInvocationDetail.scss';
import JobInvocationOverview from './JobInvocationOverview';
import { selectItems } from './JobInvocationSelectors';
import JobInvocationSystemStatusChart from './JobInvocationSystemStatusChart';
import JobInvocationToolbarButtons from './JobInvocationToolbarButtons';
import JobInvocationHostTable from './JobInvocationHostTable';
import { JobAdditionInfo } from './JobAdditionInfo';

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

  let isAlreadyStarted = false;
  let formattedStartDate;
  if (startAt) {
    // Ensures date string compatibility across browsers
    const convertedDate = new Date(startAt.replace(/[-.]/g, '/'));
    isAlreadyStarted = convertedDate.getTime() <= new Date().getTime();
    formattedStartDate = convertedDate.toLocaleString(
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
  }, [dispatch, task]);

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
