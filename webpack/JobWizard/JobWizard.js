/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wizard } from '@patternfly/react-core';
import { get } from 'foremanReact/redux/API';
import history from 'foremanReact/history';
import CategoryAndTemplate from './steps/CategoryAndTemplate/';
import { AdvancedFields } from './steps/AdvancedFields/AdvancedFields';
import {
  JOB_TEMPLATE,
  WIZARD_TITLES,
  initialScheduleState,
} from './JobWizardConstants';
import { selectTemplateError } from './JobWizardSelectors';
import Schedule from './steps/Schedule/';
import HostsAndInputs from './steps/HostsAndInputs/';
import './JobWizard.scss';

export const JobWizard = () => {
  const [jobTemplateID, setJobTemplateID] = useState(null);
  const [category, setCategory] = useState('');
  const [advancedValues, setAdvancedValues] = useState({});
  const [templateValues, setTemplateValues] = useState({}); // TODO use templateValues in advanced fields - description https://github.com/theforeman/foreman_remote_execution/pull/605
  const [scheduleValue, setScheduleValue] = useState(initialScheduleState);
  const [selectedTargets, setSelectedTargets] = useState({
    hosts: [],
    hostCollections: [],
    hostGroups: [],
  });
  const [hostsSearchQuery, setHostsSearchQuery] = useState('');
  const dispatch = useDispatch();

  const setDefaults = useCallback(
    ({
      data: {
        template_inputs,
        advanced_template_inputs,
        effective_user,
        job_template: { name, execution_timeout_interval, description_format },
      },
    }) => {
      const advancedTemplateValues = {};
      const defaultTemplateValues = {};
      const inputs = template_inputs;
      const advancedInputs = advanced_template_inputs;
      if (inputs) {
        setTemplateValues(() => {
          inputs.forEach(input => {
            defaultTemplateValues[input.name] = input?.default || '';
          });
          return defaultTemplateValues;
        });
      }
      setAdvancedValues(currentAdvancedValues => {
        if (advancedInputs) {
          advancedInputs.forEach(input => {
            advancedTemplateValues[input.name] = input?.default || '';
          });
        }
        const generateDefaultDescription = () => {
          if (description_format) return description_format;
          const allInputs = [...advancedInputs, ...inputs];
          if (!allInputs.length) return name;
          const inputsString = allInputs
            .map(({ name: inputname }) => `${inputname}="%{${inputname}}"`)
            .join(' ');
          return `${name} with inputs ${inputsString}`;
        };
        return {
          ...currentAdvancedValues,
          effectiveUserValue: effective_user?.value || '',
          timeoutToKill: execution_timeout_interval || '',
          templateValues: advancedTemplateValues,
          description: generateDefaultDescription() || '',
          isRandomizedOrdering: false,
        };
      });
    },
    []
  );
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
      name: WIZARD_TITLES.categoryAndTemplate,
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
      name: WIZARD_TITLES.hostsAndInputs,
      component: (
        <HostsAndInputs
          templateValues={templateValues}
          setTemplateValues={setTemplateValues}
          selected={selectedTargets}
          setSelected={setSelectedTargets}
          hostsSearchQuery={hostsSearchQuery}
          setHostsSearchQuery={setHostsSearchQuery}
        />
      ),
      canJumpTo: isTemplate,
    },
    {
      name: WIZARD_TITLES.advanced,
      component: (
        <AdvancedFields
          advancedValues={advancedValues}
          setAdvancedValues={newValues => {
            setAdvancedValues(currentAdvancedValues => ({
              ...currentAdvancedValues,
              ...newValues,
            }));
          }}
          templateValues={templateValues}
        />
      ),
      canJumpTo: isTemplate,
    },
    {
      name: WIZARD_TITLES.schedule,
      component: (
        <Schedule
          scheduleValue={scheduleValue}
          setScheduleValue={setScheduleValue}
        />
      ),
      canJumpTo: isTemplate,
    },
    {
      name: WIZARD_TITLES.review,
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
