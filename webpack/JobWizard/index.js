import React from 'react';
import { Title, Divider } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { JobWizard } from './JobWizard';

const JobWizardPage = () => {
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/jobs` },
      { caption: title },
    ],
  };
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
