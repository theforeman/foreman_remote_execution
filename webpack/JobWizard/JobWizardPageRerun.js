import React from 'react';
import PropTypes from 'prop-types';
import URI from 'urijs';
import { Alert, Title, Divider, Skeleton } from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { STATUS } from 'foremanReact/constants';
import {
  useForemanOrganization,
  useForemanLocation,
} from 'foremanReact/Root/Context/ForemanContext';
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
  const { response, status } = useAPI(
    'get',
    `/ui_job_wizard/job_invocation?id=${id}${
      failedOnly ? '&failed_only=1' : ''
    }`,
    JOB_API_KEY
  );
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/jobs` },
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
    >
      <React.Fragment>
        <Title headingLevel="h2" size="2xl">
          {title}
        </Title>
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
                className="job-wizard-alert"
                variant="warning"
                title={sprintf(
                  __(
                    "Current organization %s is different from job's organization %s.",
                    currentOrganization,
                    jobOrganization
                  )
                )}
              />
            )}
            {jobLocation?.id !== currentLocation?.id && (
              <Alert
                className="job-wizard-alert"
                variant="warning"
                title={sprintf(
                  __(
                    "Current location %s is different from job's location %s.",
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
