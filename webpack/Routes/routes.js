import React from 'react';
import JobWizardPage from '../JobWizard';
import JobWizardPageRerun from '../JobWizard/JobWizardPageRerun';
import JobInvocationDetailPage from '../JobInvocationDetail';

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
    path: '/experimental/job_invocations_detail/:id',
    exact: true,
    render: props => <JobInvocationDetailPage {...props} />,
  },
];

export default ForemanREXRoutes;
