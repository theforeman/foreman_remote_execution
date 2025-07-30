import React from 'react';
import JobWizardPage from '../JobWizard';
import JobWizardPageRerun from '../JobWizard/JobWizardPageRerun';
import JobInvocationDetailPage from '../JobInvocationDetail';
import TemplateInvocationPage from '../JobInvocationDetail/TemplateInvocationPage';

const ForemanREXRoutes = [
  {
    path: '/job_invocations/new',
    exact: true,
    render: props => <JobWizardPage {...props} />,
  },
  {
    path: '/job_invocations/:id/rerun',
    exact: true,
    render: props => <JobWizardPageRerun {...props} />,
  },
  {
    path: '/job_invocations/:id',
    exact: true,
    render: props => <JobInvocationDetailPage {...props} />,
  },
  {
    path: '/job_invocations_detail/:jobID/host_invocation/:hostID',
    exact: true,
    render: props => <TemplateInvocationPage {...props} />,
  },
];

export default ForemanREXRoutes;
