import React, { useEffect, useState } from 'react';
import {
  Button,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import EllipsisWithTooltip from 'react-ellipsis-with-tooltip';
import { get } from 'foremanReact/redux/API';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
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
} from '../../JobWizardConstants';
import { buildHostQuery } from '../HostsAndInputs/buildHostQuery';
import { WizardTitle } from '../form/WizardTitle';

const ReviewDetails = ({
  jobCategory,
  jobTemplateID,
  advancedValues,
  scheduleValue,
  templateValues,
  selectedTargets,
  hostsSearchQuery,
}) => {
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
  const stringHosts = () => {
    if (hosts.length === 0) {
      return __('No Target Hosts');
    }
    if (hosts.length === 1 || hosts.length === 2) {
      return hosts.join(', ');
    }
    return `${hosts[0]}, ${hosts[1]} ${sprintf(
      __(', and %s more'),
      hostsCount - 2
    )}`;
  };
  const [isAdvancedShown, setIsAdvancedShown] = useState(false);
  const detailsFirstHalf = [
    { label: __('Job category'), value: jobCategory },
    { label: __('Job template'), value: jobTemplate },
    { label: __('Target hosts'), value: stringHosts() },
    ...templateInputs.map(({ name }) => ({
      label: name,
      value: templateValues[name],
    })),
    {
      label: __('Advanced fields'),
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
      label: __('Schedule type'),
      value: scheduleValue.scheduleType,
    },
    {
      label: __('Recurrence'),
      value: scheduleValue.repeatType,
    },
    {
      label: __('Type of query'),
      value: scheduleValue.isTypeStatic
        ? __('Static query')
        : __('Dynamic query'),
    },
  ].filter(d => d);

  const advancedFields = [
    { label: __('Effective user'), value: advancedValues.effectiveUserValue },
    { label: __('Description Template'), value: advancedValues.description },
    { label: __('Timeout to kill'), value: advancedValues.timeoutToKill },
    { label: __('Concurrency level'), value: advancedValues.concurrencyLevel },
    { label: __('Time span'), value: advancedValues.timeSpan },
    {
      label: __('Execution ordering'),
      value: advancedValues.isRandomizedOrdering
        ? __('Randomized')
        : __('Alphabetical'),
    },
    ...advancedTemplateInputs.map(({ name }) => ({
      label: name,
      value: advancedValues.templateValues[name],
    })),
  ];

  return (
    <>
      <WizardTitle
        title={WIZARD_TITLES.review}
        className="advanced-fields-title"
      />
      <DescriptionList isHorizontal className="review-details">
        {detailsFirstHalf.map(({ label, value }, index) => (
          <DescriptionListGroup key={index}>
            <DescriptionListTerm>{label}</DescriptionListTerm>
            <DescriptionListDescription>
              <EllipsisWithTooltip>{value || ''}</EllipsisWithTooltip>
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
        {isAdvancedShown &&
          advancedFields.map(({ label, value }, index) => (
            <DescriptionListGroup key={index} className="advanced-fields">
              <DescriptionListTerm>{label}</DescriptionListTerm>
              <DescriptionListDescription>
                <EllipsisWithTooltip>{value || ''}</EllipsisWithTooltip>
              </DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        {detailsSecondHalf.map(({ label, value }, index) => (
          <DescriptionListGroup key={index}>
            <DescriptionListTerm>{label}</DescriptionListTerm>
            <DescriptionListDescription>
              <EllipsisWithTooltip>{value || ''}</EllipsisWithTooltip>
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
};

ReviewDetails.defaultProps = { jobTemplateID: null };
export default ReviewDetails;
