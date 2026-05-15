import PropTypes from 'prop-types';
import React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl, visit } from 'foremanReact/common/helpers';
import ResourceLoadFailedEmptyState from 'foremanReact/components/common/EmptyState/ResourceLoadFailedEmptyState';

const jobInvocationsIndexPath = '/job_invocations';

const JobInvocationEmptyState = ({ jobInvocationId, errorMessage }) => (
  <PageSection variant={PageSectionVariants.light}>
    <ResourceLoadFailedEmptyState
      resourceLabel={__('job invocation')}
      resourceId={jobInvocationId}
      errorMessage={errorMessage}
      requiredPermissions={['view_job_invocations']}
      primaryAction={{
        label: __('Go to job invocations'),
        onClick: () => visit(foremanUrl(jobInvocationsIndexPath)),
        ouiaId: 'job-invocation-empty-state-go-to-job-invocations-button',
      }}
      secondaryActions={[
        {
          label: __('Create a new job invocation'),
          onClick: () => visit(foremanUrl('/job_invocations/new')),
          ouiaId: 'job-invocation-empty-state-create-new-job-invocation-button',
        },
      ]}
      backButtonLabel={__('Return to the last page')}
      ouiaIdPrefix="job-invocation-empty-state"
    />
  </PageSection>
);

JobInvocationEmptyState.propTypes = {
  jobInvocationId: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

JobInvocationEmptyState.defaultProps = {
  errorMessage: null,
};

export default JobInvocationEmptyState;
