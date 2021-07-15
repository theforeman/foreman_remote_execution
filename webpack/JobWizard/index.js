import React from 'react';
import { Title, Divider } from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { useForemanUser } from 'foremanReact/Root/Context/ForemanContext';
import EmptyState from 'foremanReact/components/common/EmptyState/EmptyStatePattern';
import { JobWizard } from './JobWizard';

const JobWizardPage = () => {
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/jobs` },
      { caption: title },
    ],
  };
  const createPermission = 'create_job_invocations';

  const { admin, createPermissions } = useForemanUser();

  if (
    !admin &&
    !createPermissions.find(permission => permission === createPermission)
  ) {
    return (
      <EmptyState
        iconType="fa"
        icon="lock"
        header={__('Permission denied')}
        description={sprintf(
          __(
            'You are not authorized to perform this action. Please request one of the required permissions listed below from a Foreman administrator: %s'
          ),
          createPermission
        )}
      />
    );
  }

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
        <Divider component="div" />
        <JobWizard />
      </React.Fragment>
    </PageLayout>
  );
};

export default JobWizardPage;
