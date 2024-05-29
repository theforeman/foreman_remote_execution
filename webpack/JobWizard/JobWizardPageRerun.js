import PropTypes from 'prop-types';
import React from 'react';
import URI from 'urijs';
import { Alert, Button, Divider, Skeleton } from '@patternfly/react-core';
import {
  useForemanLocation,
  useForemanOrganization,
} from 'foremanReact/Root/Context/ForemanContext';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { STATUS } from 'foremanReact/constants';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { JobWizard } from './JobWizard';
import { JOB_API_KEY } from './JobWizardConstants';

const JobWizardPageRerun = ({
  match: {
    params: { id },
  },
  location: { search },
}) => {
  const uri = new URI(search);
  const { failed_only: failedOnly } = uri.search(true);
  const { succeeded_only: succeededOnly } = uri.search(true);
  let queryParams = '';
  if (failedOnly) {
    queryParams = '&failed_only=1';
  } else if (succeededOnly) {
    queryParams = '&succeeded_only=1';
  }
  const { response, status } = useAPI(
    'get',
    `/ui_job_wizard/job_invocation?id=${id}${queryParams}`,
    JOB_API_KEY
  );
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: title },
    ],
  };

  const jobOrganization = response.job_organization;
  const jobLocation = response.job_location;
  const currentOrganization = useForemanOrganization();
  const currentLocation = useForemanLocation();

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
          {__('Use old form')}
        </Button>
      }
    >
      <React.Fragment>
        <React.Fragment>
          <Divider component="div" />
        </React.Fragment>
        {!status || status === STATUS.PENDING ? (
          <div style={{ height: '400px' }}>
            <Skeleton
              height="100%"
              screenreaderText="Loading large rectangle contents"
            />
          </div>
        ) : (
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
              rerunData={{ ...response?.job, inputs: response?.inputs } || null}
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
