import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider, PageSection, Flex } from '@patternfly/react-core';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { stopInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { getData } from './JobInvocationActions';
import { selectItems } from './JobInvocationSelectors';
import JobInvocationOverview from './JobInvocationOverview';
import JobInvocationSystemStatusChart from './JobInvocationSystemStatusChart';
import {
  JOB_INVOCATION_KEY,
  STATUS,
  DATE_OPTIONS,
} from './JobInvocationConstants';
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
  } = items;
  const finished =
    statusLabel === STATUS.FAILED || statusLabel === STATUS.SUCCEEDED;
  const autoRefresh = task?.state === STATUS.PENDING || false;

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
    dispatch(getData(`/api/job_invocations/${id}`));
    if (finished && !autoRefresh) {
      dispatch(stopInterval(JOB_INVOCATION_KEY));
    }
    return () => {
      dispatch(stopInterval(JOB_INVOCATION_KEY));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, finished, autoRefresh]);

  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: description },
    ],
    isPf4: true,
  };

  return (
    <PageLayout
      header={description}
      breadcrumbOptions={breadcrumbOptions}
      searchable={false}
    >
      <React.Fragment>
        <PageSection
          className="job-invocation-detail-page-section"
          isFilled
          variant="light"
        >
          <Flex alignItems={{ default: 'alignItemsFlexStart' }}>
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
        </PageSection>
      </React.Fragment>
    </PageLayout>
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
