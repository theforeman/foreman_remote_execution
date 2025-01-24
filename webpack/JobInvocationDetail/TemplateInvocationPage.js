import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { TemplateInvocation } from './TemplateInvocation';
import { selectTemplateInvocation } from './JobInvocationSelectors';
import { jobInvocationDetailsUrl } from './JobInvocationConstants';

const TemplateInvocationPage = ({
  match: {
    params: { hostID, jobID },
  },
}) => {
  const {
    job_invocation_description: jobDescription,
    host_name: hostName,
  } = useSelector(selectTemplateInvocation);
  const description = sprintf(__('Template Invocation for %s'), hostName);
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: jobDescription, url: jobInvocationDetailsUrl(jobID) },
      { caption: hostName },
    ],
    isPf4: true,
  };
  return (
    <PageLayout
      header={description}
      breadcrumbOptions={breadcrumbOptions}
      searchable={false}
    >
      <TemplateInvocation
        hostID={hostID}
        jobID={jobID}
        isInTableView={false}
        hostName={hostName}
      />
    </PageLayout>
  );
};

TemplateInvocationPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      jobID: PropTypes.string.isRequired,
      hostID: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default TemplateInvocationPage;
