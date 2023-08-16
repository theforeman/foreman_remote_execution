/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import {
  Button,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  WizardContextConsumer,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  selectJobTemplates,
  selectHosts,
  selectHostCount,
  selectTemplateInputs,
  selectAdvancedTemplateInputs,
} from '../../JobWizardSelectors';
import {
  HOSTS_API,
  HOSTS_TO_PREVIEW_AMOUNT,
  WIZARD_TITLES,
  SCHEDULE_TYPES,
} from '../../JobWizardConstants';
import { buildHostQuery } from '../HostsAndInputs/buildHostQuery';
import { WizardTitle } from '../form/WizardTitle';
import { parseEnd, parseRepeat } from './helpers';
import { HostPreviewModal } from '../HostsAndInputs/HostPreviewModal';

const maskValue = (isHidden, value) =>
  isHidden ? '*'.repeat(value.length) : value;

const ReviewDetails = ({
  jobCategory,
  jobTemplateID,
  advancedValues,
  scheduleValue,
  templateValues,
  selectedTargets,
  hostsSearchQuery,
  goToStepByName,
}) => {
  // eslint-disable-next-line react/prop-types
  const StepButton = ({ stepName, children }) => (
    <Button
      variant="link"
      isInline
      onClick={() => {
        goToStepByName(stepName);
      }}
    >
      {children}
    </Button>
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      get({
        key: HOSTS_API,
        url: '/api/hosts',
        params: {
          search: buildHostQuery(selectedTargets, hostsSearchQuery),
          per_page: HOSTS_TO_PREVIEW_AMOUNT,
        },
      })
    );
  }, [dispatch, hostsSearchQuery, selectedTargets]);
  const jobTemplates = useSelector(selectJobTemplates);
  const templateInputs = useSelector(selectTemplateInputs);
  const advancedTemplateInputs = useSelector(selectAdvancedTemplateInputs);
  const jobTemplate = jobTemplates.find(
    template => template.id === jobTemplateID
  )?.name;

  const hosts = useSelector(selectHosts);

  const hostsCount = useSelector(selectHostCount);
  const [hostPreviewOpen, setHostPreviewOpen] = useState(false);
  const stringHosts = () => {
    if (hosts.length === 0) {
      return __('No Target Hosts');
    }
    if (hosts.length === 1 || hosts.length === 2) {
      return hosts.join(', ');
    }
    return (
      <div>
        {hostsCount} {__('hosts')}{' '}
        <Button
          variant="link"
          isInline
          onClick={() => setHostPreviewOpen(true)}
        >
          {__('view host names')}
        </Button>
      </div>
    );
  };
  const [isAdvancedShown, setIsAdvancedShown] = useState(false);
  const detailsFirstHalf = [
    {
      label: (
        <StepButton stepName={WIZARD_TITLES.categoryAndTemplate}>
          {__('Job category')}
        </StepButton>
      ),
      value: jobCategory,
    },
    {
      label: (
        <StepButton stepName={WIZARD_TITLES.categoryAndTemplate}>
          {__('Job template')}
        </StepButton>
      ),
      value: jobTemplate,
    },
    {
      label: (
        <StepButton stepName={WIZARD_TITLES.hostsAndInputs}>
          {__('Target hosts')}
        </StepButton>
      ),
      value: stringHosts(),
    },
    ...templateInputs.map(({ name, hidden_value: isHidden }) => ({
      label: (
        <StepButton stepName={WIZARD_TITLES.hostsAndInputs}>{name}</StepButton>
      ),
      value: maskValue(isHidden, templateValues[name]),
    })),
    {
      label: (
        <StepButton stepName={WIZARD_TITLES.advanced}>
          {__('Advanced fields')}
        </StepButton>
      ),
      value: isAdvancedShown ? (
        <Button
          variant="link"
          isInline
          onClick={() => {
            setIsAdvancedShown(false);
          }}
        >
          {__('Hide all advanced fields')}
        </Button>
      ) : (
        <Button
          variant="link"
          isInline
          onClick={() => {
            setIsAdvancedShown(true);
          }}
        >
          {__('Show all advanced fields')}
        </Button>
      ),
    },
  ].filter(d => d);

  const detailsSecondHalf = [
    {
      label: (
        <StepButton stepName={WIZARD_TITLES.typeOfExecution}>
          {__('Schedule type')}
        </StepButton>
      ),
      value: scheduleValue.scheduleType,
    },
    {
      label: (
        <StepButton
          stepName={
            scheduleValue.scheduleType === SCHEDULE_TYPES.RECURRING
              ? SCHEDULE_TYPES.RECURRING
              : WIZARD_TITLES.typeOfExecution
          }
        >
          {__('Recurrence')}
        </StepButton>
      ),
      value: scheduleValue.repeatType,
    },
    scheduleValue.scheduleType === SCHEDULE_TYPES.FUTURE &&
      scheduleValue.startsAt && {
        label: (
          <StepButton
            stepName={
              scheduleValue.scheduleType === SCHEDULE_TYPES.RECURRING
                ? SCHEDULE_TYPES.RECURRING
                : SCHEDULE_TYPES.FUTURE
            }
          >
            {__('Starts at')}
          </StepButton>
        ),
        value: new Date(scheduleValue.startsAt).toString(),
      },
    scheduleValue.scheduleType === SCHEDULE_TYPES.FUTURE &&
      scheduleValue.startsBefore && {
        label: (
          <StepButton stepName={SCHEDULE_TYPES.FUTURE}>
            {__('Starts Before')}
          </StepButton>
        ),
        value: new Date(scheduleValue.startsBefore).toString(),
      },

    scheduleValue.scheduleType === SCHEDULE_TYPES.RECURRING && {
      label: (
        <StepButton stepName={SCHEDULE_TYPES.RECURRING}>
          {__('Starts')}
        </StepButton>
      ),
      value: scheduleValue.isFuture
        ? new Date(scheduleValue.startsAt).toString()
        : __('Now'),
    },

    scheduleValue.scheduleType === SCHEDULE_TYPES.RECURRING && {
      label: (
        <StepButton stepName={SCHEDULE_TYPES.RECURRING}>
          {__('Repeats')}
        </StepButton>
      ),
      value: parseRepeat(scheduleValue.repeatType, scheduleValue.repeatData),
    },
    scheduleValue.scheduleType === SCHEDULE_TYPES.RECURRING && {
      label: (
        <StepButton stepName={SCHEDULE_TYPES.RECURRING}>
          {__('Ends')}
        </StepButton>
      ),
      value: parseEnd(
        scheduleValue.ends,
        scheduleValue.isNeverEnds,
        scheduleValue.repeatAmount
      ),
    },

    scheduleValue.scheduleType === SCHEDULE_TYPES.RECURRING && {
      label: (
        <StepButton stepName={SCHEDULE_TYPES.RECURRING}>
          {__('Purpose')}
        </StepButton>
      ),
      value: scheduleValue.purpose,
    },
    {
      label: (
        <StepButton stepName={WIZARD_TITLES.typeOfExecution}>
          {__('Type of query')}
        </StepButton>
      ),
      value: scheduleValue.isTypeStatic
        ? __('Static query')
        : __('Dynamic query'),
    },
  ].filter(d => d);

  const advancedFields = [
    { label: __('SSH user'), value: advancedValues.sshUser },
    { label: __('Effective user'), value: advancedValues.effectiveUserValue },
    { label: __('Description Template'), value: advancedValues.description },
    { label: __('Timeout to kill'), value: advancedValues.timeoutToKill },
    { label: __('Time to pickup'), value: advancedValues.timeToPickup },
    { label: __('Concurrency level'), value: advancedValues.concurrencyLevel },
    {
      label: __('Execution ordering'),
      value: advancedValues.isRandomizedOrdering
        ? __('Randomized')
        : __('Alphabetical'),
    },
    ...advancedTemplateInputs.map(({ name, hidden_value: isHidden }) => ({
      label: name,
      value: maskValue(isHidden, advancedValues.templateValues[name]),
    })),
  ];

  return (
    <>
      <HostPreviewModal
        isOpen={hostPreviewOpen}
        setIsOpen={setHostPreviewOpen}
        searchQuery={buildHostQuery(selectedTargets, hostsSearchQuery)}
      />
      <WizardTitle
        title={WIZARD_TITLES.review}
        className="advanced-fields-title"
      />
      <DescriptionList isHorizontal className="review-details">
        {detailsFirstHalf.map(({ label, value }, index) => (
          <DescriptionListGroup key={index}>
            <DescriptionListTerm>{label}</DescriptionListTerm>
            <DescriptionListDescription>
              {value || ''}
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
        {isAdvancedShown &&
          advancedFields.map(({ label, value }, index) => (
            <DescriptionListGroup key={index} className="advanced-fields">
              <DescriptionListTerm>{label}</DescriptionListTerm>
              <DescriptionListDescription>
                {value || ''}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        {detailsSecondHalf.map(({ label, value }, index) => (
          <DescriptionListGroup key={index}>
            <DescriptionListTerm>{label}</DescriptionListTerm>
            <DescriptionListDescription>
              {value || ''}
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </>
  );
};

ReviewDetails.propTypes = {
  jobCategory: PropTypes.string.isRequired,
  jobTemplateID: PropTypes.number,
  advancedValues: PropTypes.object.isRequired,
  scheduleValue: PropTypes.object.isRequired,
  templateValues: PropTypes.object.isRequired,
  selectedTargets: PropTypes.object.isRequired,
  hostsSearchQuery: PropTypes.string.isRequired,
  goToStepByName: PropTypes.func.isRequired,
};

ReviewDetails.defaultProps = { jobTemplateID: null };

const WrappedReviewDetails = props => (
  <WizardContextConsumer>
    {({ goToStepByName }) => (
      <ReviewDetails goToStepByName={goToStepByName} {...props} />
    )}
  </WizardContextConsumer>
);

export default WrappedReviewDetails;
