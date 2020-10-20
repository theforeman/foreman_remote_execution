import React from 'react';
import JobWizardPage from '../JobWizard';

const ForemanREXRoutes = [
  {
    path: '/experimental/job_wizard',
    exact: true,
    render: props => <JobWizardPage {...props} />,
  },
];

export default ForemanREXRoutes;
