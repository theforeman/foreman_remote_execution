/* eslint-disable max-lines */
/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Wizard } from '@patternfly/react-core';
import { get } from 'foremanReact/redux/API';
import history from 'foremanReact/history';

import {
  useForemanOrganization,
  useForemanLocation,
} from 'foremanReact/Root/Context/ForemanContext';
import CategoryAndTemplate from './steps/CategoryAndTemplate/';
import { AdvancedFields } from './steps/AdvancedFields/AdvancedFields';
import {
  JOB_TEMPLATE,
  WIZARD_TITLES,
  SCHEDULE_TYPES,
  initialScheduleState,
} from './JobWizardConstants';
import {
  selectTemplateError,
  selectJobTemplate,
  selectIsSubmitting,
  selectRouterSearch,
  selectIsLoading,
  selectJobCategoriesResponse,
} from './JobWizardSelectors';
import { ScheduleType } from './steps/Schedule/ScheduleType';
import { ScheduleFuture } from './steps/Schedule/ScheduleFuture';
import { ScheduleRecurring } from './steps/Schedule/ScheduleRecurring';
import HostsAndInputs from './steps/HostsAndInputs/';
import ReviewDetails from './steps/ReviewDetails/';
import { useValidation } from './validation';
import { useAutoFill } from './autofill';
import { submit } from './submit';
import { generateDefaultDescription } from './JobWizardHelpers';
import { StartsBeforeErrorAlert } from './StartsBeforeErrorAlert';
import { Footer } from './Footer';
import './JobWizard.scss';

export const JobWizard = ({ rerunData }) => {
  const jobCategoriesResponse = useSelector(selectJobCategoriesResponse);
  const [jobTemplateID, setJobTemplateID] = useState(
    rerunData?.template_invocations?.[0]?.template_id ||
      jobCategoriesResponse?.default_template
  );
  const [category, setCategory] = useState(
    rerunData?.job_category || jobCategoriesResponse?.default_category || ''
  );
  const [advancedValues, setAdvancedValues] = useState({ templateValues: {} });
  const [templateValues, setTemplateValues] = useState({});
  const [scheduleValue, setScheduleValue] = useState(initialScheduleState);
  const [selectedTargets, setSelectedTargets] = useState({
    hosts: [],
    hostCollections: [],
    hostGroups: [],
  });
  const [hostsSearchQuery, setHostsSearchQuery] = useState('');
  const routerSearch = useSelector(selectRouterSearch);
  const [fills, setFills] = useState(
    rerunData
      ? {
          search: rerunData?.targeting?.search_query,
          ...rerunData.inputs,
          ...routerSearch,
        }
      : routerSearch
  );
  const dispatch = useDispatch();

  const setDefaults = useCallback(
    ({
      data: {
        template_inputs = [],
        advanced_template_inputs = [],
        effective_user,
        job_template: {
          name,
          execution_timeout_interval,
          time_to_pickup,
          description_format,
          job_category,
        },
        randomized_ordering,
        ssh_user,
        concurrency_control = {},
      },
    }) => {
      if (category !== job_category) {
        setCategory(job_category);
      }
      const advancedTemplateValues = {};
      const defaultTemplateValues = {};
      const inputs = template_inputs;
      const advancedInputs = advanced_template_inputs;
      if (inputs) {
        setTemplateValues(prev => {
          inputs.forEach(input => {
            defaultTemplateValues[input.name] =
              prev[input.name] || input?.default || '';
          });
          return defaultTemplateValues;
        });
      }
      setAdvancedValues(currentAdvancedValues => {
        if (advancedInputs) {
          advancedInputs.forEach(input => {
            advancedTemplateValues[input.name] =
              currentAdvancedValues[input.name] || input?.default || '';
          });
        }
        return {
          ...currentAdvancedValues,
          effectiveUserValue: effective_user?.value || '',
          timeoutToKill: execution_timeout_interval || '',
          timeToPickup: time_to_pickup || '',
          templateValues: advancedTemplateValues,
          description:
            generateDefaultDescription({
              description_format,
              advancedInputs,
              inputs,
              name,
            }) || '',
          isRandomizedOrdering: randomized_ordering,
          sshUser: ssh_user || '',
          timeSpan: concurrency_control.time_span || '',
          concurrencyLevel: concurrency_control.level || '',
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category.length]
  );
  useEffect(() => {
    if (rerunData) {
      setDefaults({
        data: {
          effective_user: {
            value: rerunData.template_invocations[0].effective_user,
          },
          job_template: {
            execution_timeout_interval: rerunData.execution_timeout_interval,
            description_format: rerunData.description_format,
            job_category: rerunData.job_category,
            time_to_pickup: rerunData.time_to_pickup,
          },
          randomized_ordering: rerunData.targeting.randomized_ordering,
          ssh_user: rerunData.ssh_user,
          concurrency_control: rerunData.concurrency_control,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerunData]);
  useEffect(() => {
    if (jobTemplateID) {
      dispatch(
        get({
          key: JOB_TEMPLATE,
          url: `/ui_job_wizard/template/${jobTemplateID}`,
          handleSuccess: rerunData
            ? ({
                data: {
                  template_inputs = [],
                  advanced_template_inputs = [],
                  job_template: { name, description_format },
                },
              }) => {
                const allowedInputs = template_inputs
                  .map(({ name: _name }) => _name)
                  .concat(
                    advanced_template_inputs.map(({ name: _name }) => _name)
                  );
                const prune = inputs =>
                  allowedInputs.reduce(
                    (acc, key) =>
                      inputs.hasOwnProperty(key)
                        ? { [key]: inputs[key], ...acc }
                        : acc,
                    {}
                  );
                setTemplateValues(prune);
                setAdvancedValues(currentAdvancedValues => ({
                  ...currentAdvancedValues,
                  templateValues: prune(currentAdvancedValues.templateValues),
                  description:
                    generateDefaultDescription({
                      description_format,
                      advancedInputs: advanced_template_inputs,
                      inputs: template_inputs,
                      name,
                    }) || '',
                }));
              }
            : setDefaults,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerunData, jobTemplateID, dispatch]);

  const [isStartsBeforeError, setIsStartsBeforeError] = useState(false);
  useEffect(() => {
    const updateStartsBeforeError = () => {
      setIsStartsBeforeError(
        scheduleValue.scheduleType === SCHEDULE_TYPES.FUTURE &&
          new Date().getTime() >= new Date(scheduleValue.startsBefore).getTime()
      );
    };
    let interval;
    if (scheduleValue.scheduleType === SCHEDULE_TYPES.FUTURE) {
      updateStartsBeforeError();
      interval = setInterval(updateStartsBeforeError, 5000);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [scheduleValue.scheduleType, scheduleValue.startsBefore]);

  const [valid, setValid] = useValidation({
    advancedValues,
    templateValues,
  });
  useAutoFill({
    fills,
    setFills,
    setSelectedTargets,
    setHostsSearchQuery,
    setJobTemplateID,
    setTemplateValues,
    setAdvancedValues,
  });
  const templateError = !!useSelector(selectTemplateError);
  const templateResponse = useSelector(selectJobTemplate);
  const isSubmitting = useSelector(selectIsSubmitting);
  const isTemplatesLoading = useSelector(state =>
    selectIsLoading(state, JOB_TEMPLATE)
  );
  const isTemplate =
    !isTemplatesLoading &&
    !templateError &&
    !!jobTemplateID &&
    templateResponse.job_template;
  const areHostsSelected =
    selectedTargets.hosts.length > 0 ||
    selectedTargets.hostCollections.length > 0 ||
    selectedTargets.hostGroups.length > 0 ||
    hostsSearchQuery.length > 0;
  const steps = [
    {
      name: WIZARD_TITLES.categoryAndTemplate,
      component: (
        <CategoryAndTemplate
          jobTemplate={jobTemplateID}
          setJobTemplate={setJobTemplateID}
          category={category}
          setCategory={setCategory}
          isCategoryPreselected={
            !!rerunData || !!fills.feature || !!fills.template_id
          }
        />
      ),
      enableNext: isTemplate,
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
      enableNext: isTemplate && valid.hostsAndInputs && areHostsSelected,
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
      canJumpTo: isTemplate && valid.hostsAndInputs && areHostsSelected,
      enableNext:
        isTemplate &&
        valid.hostsAndInputs &&
        areHostsSelected &&
        valid.advanced,
    },
    {
      name: WIZARD_TITLES.schedule,
      canJumpTo:
        isTemplate &&
        valid.hostsAndInputs &&
        areHostsSelected &&
        valid.advanced,
      enableNext:
        isTemplate &&
        valid.hostsAndInputs &&
        areHostsSelected &&
        valid.advanced &&
        valid.schedule,
      steps: [
        {
          name: WIZARD_TITLES.typeOfExecution,
          component: (
            <ScheduleType
              scheduleType={scheduleValue.scheduleType}
              isTypeStatic={scheduleValue.isTypeStatic}
              setScheduleValue={setScheduleValue}
              setValid={newValue => {
                setValid(currentValid => ({
                  ...currentValid,
                  schedule: newValue,
                }));
              }}
            />
          ),
          canJumpTo:
            isTemplate &&
            valid.hostsAndInputs &&
            areHostsSelected &&
            valid.advanced,

          enableNext:
            isTemplate &&
            valid.hostsAndInputs &&
            areHostsSelected &&
            valid.advanced,
        },
        ...(scheduleValue.scheduleType === SCHEDULE_TYPES.FUTURE
          ? [
              {
                name: SCHEDULE_TYPES.FUTURE,
                component: (
                  <ScheduleFuture
                    scheduleValue={scheduleValue}
                    setScheduleValue={setScheduleValue}
                    setValid={newValue => {
                      setValid(currentValid => ({
                        ...currentValid,
                        schedule: newValue,
                      }));
                    }}
                  />
                ),
                canJumpTo:
                  isTemplate &&
                  valid.hostsAndInputs &&
                  areHostsSelected &&
                  valid.advanced,
                enableNext:
                  isTemplate &&
                  valid.hostsAndInputs &&
                  areHostsSelected &&
                  valid.advanced &&
                  valid.schedule,
              },
            ]
          : []),
        ...(scheduleValue.scheduleType === SCHEDULE_TYPES.RECURRING
          ? [
              {
                name: SCHEDULE_TYPES.RECURRING,
                component: (
                  <ScheduleRecurring
                    scheduleValue={scheduleValue}
                    setScheduleValue={setScheduleValue}
                    setValid={newValue => {
                      setValid(currentValid => ({
                        ...currentValid,
                        schedule: newValue,
                      }));
                    }}
                  />
                ),
                canJumpTo:
                  isTemplate &&
                  valid.hostsAndInputs &&
                  areHostsSelected &&
                  valid.advanced,
                enableNext:
                  isTemplate &&
                  valid.hostsAndInputs &&
                  areHostsSelected &&
                  valid.advanced &&
                  valid.schedule,
              },
            ]
          : []),
      ],
    },
    {
      name: WIZARD_TITLES.review,
      component: (
        <ReviewDetails
          jobCategory={category}
          jobTemplateID={jobTemplateID}
          advancedValues={advancedValues}
          scheduleValue={scheduleValue}
          templateValues={templateValues}
          selectedTargets={selectedTargets}
          hostsSearchQuery={hostsSearchQuery}
        />
      ),
      nextButtonText: 'Run',
      canJumpTo:
        isTemplate &&
        valid.advanced &&
        valid.hostsAndInputs &&
        areHostsSelected &&
        valid.schedule,
      enableNext:
        isTemplate &&
        valid.hostsAndInputs &&
        areHostsSelected &&
        valid.advanced &&
        valid.schedule &&
        !isSubmitting &&
        !isStartsBeforeError,
    },
  ];
  const location = useForemanLocation();
  const organization = useForemanOrganization();
  const onSave = () => {
    submit({
      jobTemplateID,
      templateValues,
      advancedValues,
      scheduleValue,
      dispatch,
      selectedTargets,
      hostsSearchQuery,
      location,
      organization,
      feature: routerSearch?.feature,
      provider: templateResponse.provider_name,
      advancedInputs: templateResponse.advanced_template_inputs,
    });
  };
  return (
    <>
      {isStartsBeforeError && <StartsBeforeErrorAlert />}
      <Wizard
        onClose={() => history.goBack()}
        navAriaLabel="Run Job steps"
        steps={steps}
        height="100%"
        className="job-wizard"
        onSave={onSave}
        footer={
          <Footer
            canSubmit={!!steps[steps.length - 1].enableNext}
            onSave={onSave}
          />
        }
      />
    </>
  );
};

JobWizard.propTypes = {
  rerunData: PropTypes.shape({
    job_category: PropTypes.string,
    targeting: PropTypes.shape({
      search_query: PropTypes.string,
      targeting_type: PropTypes.string,
      randomized_ordering: PropTypes.bool,
    }),
    triggering: PropTypes.shape({
      mode: PropTypes.string,
      start_at: PropTypes.string,
      start_before: PropTypes.string,
    }),
    ssh_user: PropTypes.string,
    concurrency_control: PropTypes.shape({
      level: PropTypes.number,
      time_span: PropTypes.number,
    }),
    execution_timeout_interval: PropTypes.number,
    time_to_pickup: PropTypes.number,
    remote_execution_feature_id: PropTypes.string,
    template_invocations: PropTypes.arrayOf(
      PropTypes.shape({
        template_id: PropTypes.number,
        effective_user: PropTypes.string,
        input_values: PropTypes.array,
      })
    ),
    inputs: PropTypes.object,
    description_format: PropTypes.string,
  }),
};
JobWizard.defaultProps = {
  rerunData: null,
};
export default JobWizard;
