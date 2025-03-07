import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URI from 'urijs';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Divider,
  Skeleton,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_palette_red_200 as exclamationColor } from '@patternfly/react-tokens';
import { get } from 'foremanReact/redux/API';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { STATUS } from 'foremanReact/constants';
import {
  useForemanLocation,
  useForemanOrganization,
} from 'foremanReact/Root/Context/ForemanContext';
import { JobWizard } from './JobWizard';
import {
  selectRerunJobInvocationResponse,
  selectRerunJobInvocationStatus,
} from './JobWizardSelectors';
import { JOB_API_KEY } from './JobWizardConstants';

const JobWizardPageRerun = ({
  match: {
    params: { id },
  },
  location: { search },
}) => {
  const dispatch = useDispatch();
  const uri = new URI(search);
  const { failed_only: failedOnly } = uri.search(true);
  const { succeeded_only: succeededOnly } = uri.search(true);
  let queryParams = '';
  if (failedOnly) {
    queryParams = '&failed_only=1';
  } else if (succeededOnly) {
    queryParams = '&succeeded_only=1';
  }
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: title },
    ],
  };

  const [errorMessage, setErrorMessage] = useState('');
  const jobInvocationResponse = useSelector(selectRerunJobInvocationResponse);
  const jobInvocationStatus = useSelector(selectRerunJobInvocationStatus);
  const jobOrganization = jobInvocationResponse.job_organization;
  const jobLocation = jobInvocationResponse.job_location;
  const currentOrganization = useForemanOrganization();
  const currentLocation = useForemanLocation();

  const emptyStateLarge = (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText={<>{__('Unable to run job')}</>}
        icon={
          <EmptyStateIcon
            icon={ExclamationCircleIcon}
            color={exclamationColor.value}
          />
        }
        headingLevel="h4"
      />
      <EmptyStateBody>{sprintf(errorMessage)}</EmptyStateBody>
      <EmptyStateFooter>
        <Button
          ouiaId="job-wizard-run-job-button"
          component="a"
          href="/job_invocations/new"
          variant="primary"
        >
          {__('Create job')}
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );

  useEffect(() => {
    let isMounted = true;
    if (id !== undefined) {
      dispatch(
        get({
          key: JOB_API_KEY,
          url: `/ui_job_wizard/job_invocation?id=${id}${queryParams}`,
          handleError: ({ response }) => {
            if (isMounted) {
              setErrorMessage(response?.data?.error?.message);
            }
          },
        })
      );
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, id, failedOnly, queryParams]);

  return (
    <PageLayout
      header={title}
      breadcrumbOptions={breadcrumbOptions}
      searchable={false}
      toolbarButtons={
        <Button
          ouiaId="job-wizard-rerun-old-form-button"
          variant="link"
          component="a"
          href={`/old/job_invocations/${id}/rerun${search}`}
        >
          {__('Use legacy form')}
        </Button>
      }
    >
      <React.Fragment>
        <React.Fragment>
          <Divider component="div" />
        </React.Fragment>
        {jobInvocationStatus === STATUS.ERROR && emptyStateLarge}
        {(!jobInvocationStatus || jobInvocationStatus === STATUS.PENDING) && (
          <div style={{ height: '400px' }}>
            <Skeleton
              height="100%"
              screenreaderText="Loading large rectangle contents"
            />
          </div>
        )}
        {jobInvocationStatus === STATUS.RESOLVED && (
          <React.Fragment>
            {jobOrganization?.id !== currentOrganization?.id && (
              <Alert
                ouiaId="job-wizard-alert-organization"
                isInline
                className="job-wizard-alert"
                variant="warning"
                title={sprintf(
                  __(
                    "Current organization %s is different from job's organization %s. This job may run on different hosts than before.",
                    currentOrganization,
                    jobOrganization
                  )
                )}
              />
            )}
            {jobLocation?.id !== currentLocation?.id && (
              <Alert
                ouiaId="job-wizard-alert-location"
                isInline
                className="job-wizard-alert"
                variant="warning"
                title={sprintf(
                  __(
                    "Current location %s is different from job's location %s. This job may run on different hosts than before.",
                    currentLocation,
                    jobLocation
                  )
                )}
              />
            )}
            <Divider component="div" />
            <JobWizard
              rerunData={
                {
                  ...jobInvocationResponse?.job,
                  inputs: jobInvocationResponse?.inputs,
                } || null
              }
            />
          </React.Fragment>
        )}
      </React.Fragment>
    </PageLayout>
  );
};
JobWizardPageRerun.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
JobWizardPageRerun.defaultProps = {
  location: { search: '' },
};
export default JobWizardPageRerun;
