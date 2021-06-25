import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wizard } from '@patternfly/react-core';
import { get } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import history from 'foremanReact/history';
import CategoryAndTemplate from './steps/CategoryAndTemplate/';
import { AdvancedFields } from './steps/AdvancedFields/AdvancedFields';
import { JOB_TEMPLATE } from './JobWizardConstants';
import { selectTemplateError } from './JobWizardSelectors';
import './JobWizard.scss';

export const JobWizard = () => {
  const [jobTemplateID, setJobTemplateID] = useState(null);
  const [category, setCategory] = useState('');
  const [advancedValues, setAdvancedValues] = useState({});
  const dispatch = useDispatch();

  const setDefaults = useCallback(response => {
    const responseJob = response.data;
    const advancedTemplateValues = {};
    const advancedInputs = responseJob.advanced_template_inputs;
    if (advancedInputs) {
      advancedInputs.forEach(input => {
        advancedTemplateValues[input.name] = input?.default || '';
      });
    }
    setAdvancedValues(currentAdvancedValues => ({
      ...currentAdvancedValues,
      effectiveUserValue: responseJob.effective_user?.value || '',
      timeoutToKill: responseJob.job_template?.executionTimeoutInterval || '',
      templateValues: advancedTemplateValues,
    }));
  }, []);
  useEffect(() => {
    if (jobTemplateID) {
      dispatch(
        get({
          key: JOB_TEMPLATE,
          url: `/ui_job_wizard/template/${jobTemplateID}`,
          handleSuccess: setDefaults,
        })
      );
    }
  }, [jobTemplateID, setDefaults, dispatch]);

  const templateError = !!useSelector(selectTemplateError);
  const isTemplate = !templateError && !!jobTemplateID;
  const steps = [
    {
      name: __('Category and Template'),
      component: (
        <CategoryAndTemplate
          jobTemplate={jobTemplateID}
          setJobTemplate={setJobTemplateID}
          category={category}
          setCategory={setCategory}
        />
      ),
    },
    {
      name: __('Target Hosts'),
      component: <p>Target Hosts</p>,
      canJumpTo: isTemplate,
    },
    {
      name: __('Advanced Fields'),
      component: (
        <AdvancedFields
          advancedValues={advancedValues}
          setAdvancedValues={newValues => {
            setAdvancedValues(currentAdvancedValues => ({
              ...currentAdvancedValues,
              ...newValues,
            }));
          }}
          jobTemplateID={jobTemplateID}
        />
      ),
      canJumpTo: isTemplate,
    },
    {
      name: __('Schedule'),
      component: <p>Schedule</p>,
      canJumpTo: isTemplate,
    },
    {
      name: __('Review Details'),
      component: <p>Review Details</p>,
      nextButtonText: 'Run',
      canJumpTo: isTemplate,
    },
  ];
  return (
    <Wizard
      onClose={() => history.goBack()}
      navAriaLabel="Run Job steps"
      steps={steps}
      height="100%"
      className="job-wizard"
    />
  );
};

export default JobWizard;
