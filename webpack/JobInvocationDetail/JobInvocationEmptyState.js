import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  PageSection,
  PageSectionVariants,
  EmptyStateVariant,
  EmptyStateHeader,
  EmptyStateActions,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

const jobInvocationsIndexPath = '/job_invocations';

const JobInvocationEmptyState = ({ jobInvocationId }) => {
  const history = useHistory();
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Bullseye>
        <EmptyState
          ouiaId="job-invocation-empty-state"
          variant={EmptyStateVariant.lg}
        >
          <EmptyStateIcon icon={SearchIcon} />
          <EmptyStateHeader
            titleText={<>{sprintf(__('Job invocation not found'))}</>}
            headingLevel="h5"
          />

          <EmptyStateBody>
            {sprintf(
              __(
                'There is no job invocation with id %s or there are access permissions needed. Please contact your administrator if this issue continues.'
              ),
              jobInvocationId
            )}
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button
                ouiaId="job-invocation-empty-state-go-to-job-invocations-button"
                variant="primary"
                component="a"
                href={foremanUrl(jobInvocationsIndexPath)}
                isInline
              >
                {__('Go to job invocations')}
              </Button>
            </EmptyStateActions>
            <EmptyStateActions>
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
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </Bullseye>
    </PageSection>
  );
};

JobInvocationEmptyState.propTypes = {
  jobInvocationId: PropTypes.string.isRequired,
};

export default JobInvocationEmptyState;
