import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';
import DefaultLoaderEmptyState from 'foremanReact/components/HostDetails/DetailsCard/DefaultLoaderEmptyState';
import { translate as __, documentLocale } from 'foremanReact/common/I18n';

const JobInvocationOverview = ({ data }) => {
  const {
    start_at: startAt,
    ssh_user: sshUser,
    template_id: templateId,
    template_name: templateName,
    effective_user: effectiveUser,
    permissions,
  } = data;
  const canEditJobTemplates = permissions
    ? permissions.edit_job_templates
    : false;
  const dateOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  };
  let formattedStartDate = __('Not yet');

  if (startAt) {
    // Ensures date string compatibility across browsers
    const convertedDate = new Date(startAt.replace(/[-.]/g, '/'));
    if (convertedDate.getTime() <= new Date().getTime()) {
      formattedStartDate = convertedDate.toLocaleString(
        documentLocale(),
        dateOptions
      );
    }
  }

  return (
    <DescriptionList
      columnModifier={{
        default: '2Col',
      }}
      isHorizontal
      isCompact
      isFluid
      isAutoColumnWidths
    >
      <DescriptionListGroup>
        <DescriptionListTerm>{__('Effective user:')}</DescriptionListTerm>
        <DescriptionListDescription>
          {effectiveUser || <DefaultLoaderEmptyState />}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{__('Started at:')}</DescriptionListTerm>
        <DescriptionListDescription>
          {formattedStartDate}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{__('SSH user:')}</DescriptionListTerm>
        <DescriptionListDescription>
          {sshUser || <DefaultLoaderEmptyState />}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{__('Template:')}</DescriptionListTerm>
        <DescriptionListDescription>
          {templateName ? (
            <Button
              ouiaId="template-link"
              variant="link"
              component="a"
              isInline
              isDisabled={!canEditJobTemplates}
              href={
                templateId ? `/job_templates/${templateId}/edit` : undefined
              }
            >
              {templateName}
            </Button>
          ) : (
            <DefaultLoaderEmptyState />
          )}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};

JobInvocationOverview.propTypes = {
  data: PropTypes.object.isRequired,
};

export default JobInvocationOverview;
