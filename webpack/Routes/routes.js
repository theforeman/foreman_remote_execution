import React from 'react';
import JobWizardPage from '../JobWizard';
import JobWizardPageRerun from '../JobWizard/JobWizardPageRerun';

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
];

export default ForemanREXRoutes;
