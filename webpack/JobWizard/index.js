import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { translate as __ } from 'foremanReact/common/I18n';
import { STATUS } from 'foremanReact/constants';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import PermissionDenied from './PermissionDenied';
import { JobWizard } from './JobWizard';
import {
  CURRENT_PERMISSIONS,
  currentPermissionsUrl,
} from './JobWizardConstants';

const JobWizardPage = () => {
  const title = __('Run job');
  const breadcrumbOptions = {
    breadcrumbItems: [
      { caption: __('Jobs'), url: `/job_invocations` },
      { caption: title },
    ],
  };
  const [proceedAnyway, setProceedAnyway] = useState(false);

  const { response, status } = useAPI(
    'get',
    currentPermissionsUrl,
    CURRENT_PERMISSIONS
  );
  const desiredPermissions = [
    'view_hosts',
    'view_smart_proxies',
    'view_job_templates',
    'create_job_invocations',
    'create_template_invocations',
  ];
  const missingPermissions =
    status === STATUS.RESOLVED
      ? desiredPermissions.filter(
          permission =>
            !response.results.map(result => result.name).includes(permission)
        )
      : [];

  if (!isEmpty(missingPermissions) && !proceedAnyway) {
    return (
      <PermissionDenied
        missingPermissions={missingPermissions}
        setProceedAnyway={setProceedAnyway}
      />
    );
  }

  return (
    <PageLayout
      header={title}
      breadcrumbOptions={breadcrumbOptions}
      searchable={false}
      pageSectionType="wizard"
    >
      <React.Fragment>
        <JobWizard />
      </React.Fragment>
    </PageLayout>
  );
};

export default JobWizardPage;
