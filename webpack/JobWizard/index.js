import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Title, Flex, FlexItem, Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import PermissionDenied from 'foremanReact/components/PermissionDenied/PermissionDenied';
import { STATUS } from 'foremanReact/constants';
import {
  selectCanCreateJob,
  selectJobCategoriesStatus,
} from './JobWizardSelectors';
import { JobWizard } from './JobWizard';

const JobWizardPage = ({ location: { search } }) => {
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: title },
    ],
  };

  const canCreateJob = useSelector(selectCanCreateJob);
  const status = useSelector(selectJobCategoriesStatus);

  if (!canCreateJob && status === STATUS.RESOLVED) {
    return <PermissionDenied missingPermissions={['create_job_invocations']} />;
  }

  return (
    <PageLayout
      header={title}
      breadcrumbOptions={breadcrumbOptions}
      searchable={false}
      beforeToolbarComponent={
        <Flex>
          <FlexItem>
            <Title headingLevel="h2" size="2xl">
              {title}
            </Title>
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            <Button
              variant="link"
              component="a"
              href={`/old/job_invocations/new${search}`}
            >
              {__('Use legacy form')}
            </Button>
          </FlexItem>
        </Flex>
      }
      pageSectionType="wizard"
    >
      <React.Fragment>
        <JobWizard />
      </React.Fragment>
    </PageLayout>
  );
};

JobWizardPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};
export default JobWizardPage;
