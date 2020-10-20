import React from 'react';
import { Wizard } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import history from 'foremanReact/history';

export const JobWizard = () => {
  const steps = [
    {
      name: __('Category and template'),
      component: <p>Category and template</p>,
    },
    { name: __('Target hosts'), component: <p>TargetHosts </p> },
    { name: __('Advanced fields'), component: <p> AdvancedFields </p> },
    { name: __('Schedule'), component: <p>Schedule</p> },
    {
      name: __('Review details'),
      component: <p>ReviewDetails</p>,
      nextButtonText: 'Run',
    },
  ];
  const title = __('Run Job');
  return (
    <Wizard
      onClose={() => history.goBack()}
      navAriaLabel={`${title} steps`}
      steps={steps}
      height="70vh"
    />
  );
};

export default JobWizard;
