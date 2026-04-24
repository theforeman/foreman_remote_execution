import PropTypes from 'prop-types';
import React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import ResourceLoadFailedEmptyState from 'foremanReact/components/common/EmptyState/ResourceLoadFailedEmptyState';
import {
  jobInvocationsIndexUrl,
  jobInvocationsNewUrl,
} from './JobInvocationConstants';

const JobInvocationEmptyState = ({
  jobInvocationId,
  httpStatus,
  errorMessage,
}) => (
  <PageSection variant={PageSectionVariants.light}>
    <ResourceLoadFailedEmptyState
      resourceLabel={__('job invocation')}
      resourceId={jobInvocationId}
      httpStatus={httpStatus}
      errorMessage={errorMessage}
      viewPermissions={['view_job_invocations']}
      requiredPermissions={['view_job_invocations']}
      primaryAction={{
        label: __('Go to job invocations'),
        url: jobInvocationsIndexUrl,
        ouiaId: 'job-invocation-empty-state-go-to-job-invocations-button',
      }}
      secondaryActions={[
        {
          label: __('Create a new job invocation'),
          url: jobInvocationsNewUrl,
          ouiaId: 'job-invocation-empty-state-create-new-job-invocation-button',
        },
      ]}
      ouiaIdPrefix="job-invocation-empty-state"
    />
  </PageSection>
);

JobInvocationEmptyState.propTypes = {
  jobInvocationId: PropTypes.string.isRequired,
  httpStatus: PropTypes.number,
  errorMessage: PropTypes.string,
};

JobInvocationEmptyState.defaultProps = {
  httpStatus: null,
  errorMessage: null,
};

export default JobInvocationEmptyState;
