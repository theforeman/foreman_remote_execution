import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import DefaultLoaderEmptyState from 'foremanReact/components/HostDetails/DetailsCard/DefaultLoaderEmptyState';

const JobInvocationOverview = ({
  data,
  isAlreadyStarted,
  formattedStartDate,
}) => {
  const {
    ssh_user: sshUser,
    template_id: templateId,
    template_name: templateName,
    effective_user: effectiveUser,
    permissions,
  } = data;
  const canEditJobTemplates = permissions
    ? permissions.edit_job_templates
    : false;

  return (
    <DescriptionList
      className="job-overview-description-list"
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
          {isAlreadyStarted ? formattedStartDate : __('Not yet')}
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
  isAlreadyStarted: PropTypes.bool.isRequired,
  formattedStartDate: PropTypes.string,
};

JobInvocationOverview.defaultProps = {
  formattedStartDate: undefined,
};

export default JobInvocationOverview;
