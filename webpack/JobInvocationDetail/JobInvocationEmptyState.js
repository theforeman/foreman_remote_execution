import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import EmptyStatePattern from 'foremanReact/components/common/EmptyState/EmptyStatePattern';

const jobInvocationsIndexPath = '/job_invocations';

const JobInvocationEmptyState = ({ jobInvocationId, errorMessage = null }) => {
  const history = useHistory();

  const descriptionContent = (
    <>
      <p>
        {sprintf(
          __(
            'There is no job invocation with id %s or there are access permissions needed. Opening this page requires the view_job_invocations permission. Please contact your administrator if this issue continues.'
          ),
          jobInvocationId
        )}
      </p>
      {errorMessage ? (
        <p className="pf-v5-u-text-break" style={{ whiteSpace: 'pre-wrap' }}>
          {sprintf(__('The server returned: %s'), errorMessage)}
        </p>
      ) : null}
    </>
  );

  return (
    <PageSection variant={PageSectionVariants.light}>
      <EmptyStatePattern
        variant={EmptyStateVariant.lg}
        icon={<SearchIcon />}
        header={__('Job invocation not found')}
        description={descriptionContent}
        action={
          <Button
            ouiaId="job-invocation-empty-state-go-to-job-invocations-button"
            variant="primary"
            component="a"
            href={foremanUrl(jobInvocationsIndexPath)}
            isInline
          >
            {__('Go to job invocations')}
          </Button>
        }
        secondaryActions={
          <>
            <Button
              ouiaId="job-invocation-empty-state-create-new-job-invocation-button"
              variant="link"
              component="a"
              href={foremanUrl('/job_invocations/new')}
            >
              {__('Create a new job invocation')}
            </Button>
            <Button
              ouiaId="job-invocation-empty-state-return-to-last-page-button"
              variant="link"
              onClick={() => history.goBack()}
            >
              {__('Return to the last page')}
            </Button>
          </>
        }
      />
    </PageSection>
  );
};

JobInvocationEmptyState.propTypes = {
  jobInvocationId: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

JobInvocationEmptyState.defaultProps = {
  errorMessage: null,
};

export default JobInvocationEmptyState;
