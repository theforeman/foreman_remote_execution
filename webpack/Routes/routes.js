import React from 'react';
import JobWizardPage from '../JobWizard';
import JobWizardPageRerun from '../JobWizard/JobWizardPageRerun';

const ForemanREXRoutes = [
  {
    path: '/experimental/job_wizard/new',
    exact: true,
    render: () => <JobWizardPage />,
  },
  {
    path: '/experimental/job_wizard/:id/rerun',
    exact: true,
    render: props => <JobWizardPageRerun {...props} />,
  },
];

export default ForemanREXRoutes;
