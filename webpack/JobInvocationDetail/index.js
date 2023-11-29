import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider, PageSection, Flex, FlexItem } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { stopInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { getData } from './JobInvocationActions';
import { selectItems } from './JobInvocationSelectors';
import JobInvocationOverview from './JobInvocationOverview';
import { JOB_INVOCATION_KEY, STATUS } from './JobInvocationConstants';

const JobInvocationDetailPage = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const { description, status_label: statusLabel, task } = items;
  const finished =
    statusLabel === STATUS.FAILED || statusLabel === STATUS.SUCCEEDED;
  const autoRefresh = task?.state === STATUS.PENDING || false;

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
        <PageSection isFilled variant="light">
          <Flex>
            <FlexItem> </FlexItem>
            <Divider
              orientation={{
                default: 'vertical',
              }}
            />
            <FlexItem>
              <JobInvocationOverview data={items} />
            </FlexItem>
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
