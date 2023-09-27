import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { JobWizard } from './JobWizard';

const JobWizardPage = ({ location: { search } }) => {
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: title },
    ],
  };
  return (
    <PageLayout
      header={title}
      breadcrumbOptions={breadcrumbOptions}
      searchable={false}
      toolbarButtons={
        <Button
          variant="link"
          component="a"
          href={`/old/job_invocations/new${search}`}
        >
          {__('Use legacy form')}
        </Button>
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
