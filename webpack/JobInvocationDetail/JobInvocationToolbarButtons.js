import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownSeparator,
  DropdownToggle,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { STATUS as APIStatus } from 'foremanReact/constants';
import { get } from 'foremanReact/redux/API';
import {
  cancelJob,
  cancelRecurringLogic,
  enableRecurringLogic,
} from './JobInvocationActions';
import {
  STATUS,
  GET_REPORT_TEMPLATES,
  GET_REPORT_TEMPLATE_INPUTS,
} from './JobInvocationConstants';
import { selectTaskCancelable } from './JobInvocationSelectors';

const JobInvocationToolbarButtons = ({
  jobId,
  data,
  currentPermissions,
  permissionsStatus,
}) => {
  const { succeeded, failed, task, recurrence, permissions } = data;
  const recurringEnabled = recurrence?.state === 'active';
  const canViewForemanTasks = permissions
    ? permissions.view_foreman_tasks
    : false;
  const canEditRecurringLogic = permissions
    ? permissions.edit_recurring_logics
    : false;
  const isTaskCancelable = useSelector(selectTaskCancelable);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [reportTemplateJobId, setReportTemplateJobId] = useState(undefined);
  const [templateInputId, setTemplateInputId] = useState(undefined);
  const queryParams = new URLSearchParams({
    [`report_template_report[input_values][${templateInputId}][value]`]: jobId,
  });
  const dispatch = useDispatch();

  const onActionFocus = () => {
    const element = document.getElementById(
      `toggle-split-button-action-primary-${jobId}`
    );
    element.focus();
  };
  const onActionSelect = () => {
    setIsActionOpen(false);
    onActionFocus();
  };
  const hasPermission = permissionRequired =>
    permissionsStatus === APIStatus.RESOLVED
      ? currentPermissions?.some(
          permission => permission.name === permissionRequired
        )
      : false;

  useEffect(() => {
    dispatch(
      get({
        key: GET_REPORT_TEMPLATES,
        url: '/api/report_templates',
        handleSuccess: ({ data: { results } }) => {
          setReportTemplateJobId(
            results.find(result => result.name === 'Job - Invocation Report')
              ?.id
          );
        },
        handleError: () => {
          setReportTemplateJobId(undefined);
        },
      })
    );
  }, [dispatch]);
  useEffect(() => {
    if (reportTemplateJobId !== undefined) {
      dispatch(
        get({
          key: GET_REPORT_TEMPLATE_INPUTS,
          url: `/api/templates/${reportTemplateJobId}/template_inputs`,
          handleSuccess: ({ data: { results } }) => {
            setTemplateInputId(
              results.find(result => result.name === 'job_id')?.id
            );
          },
          handleError: () => {
            setTemplateInputId(undefined);
          },
        })
      );
    }
  }, [dispatch, reportTemplateJobId]);

  const recurrenceDropdownItems = recurrence
    ? [
        <DropdownSeparator ouiaId="dropdown-separator-1" key="separator-1" />,
        <DropdownItem
          ouiaId="change-enabled-recurring-dropdown-item"
          onClick={() =>
            dispatch(
              enableRecurringLogic(recurrence?.id, recurringEnabled, jobId)
            )
          }
          key="change-enabled-recurring"
          component="button"
          isDisabled={
            recurrence?.id === undefined ||
            recurrence?.state === 'cancelled' ||
            !canEditRecurringLogic
          }
        >
          {recurringEnabled ? __('Disable recurring') : __('Enable recurring')}
        </DropdownItem>,
        <DropdownItem
          ouiaId="cancel-recurring-dropdown-item"
          onClick={() => dispatch(cancelRecurringLogic(recurrence?.id, jobId))}
          key="cancel-recurring"
          component="button"
          isDisabled={
            recurrence?.id === undefined ||
            recurrence?.state === 'cancelled' ||
            !canEditRecurringLogic
          }
        >
          {__('Cancel recurring')}
        </DropdownItem>,
      ]
    : [];

  const dropdownItems = [
    <DropdownItem
      ouiaId="rerun-succeeded-dropdown-item"
      href={foremanUrl(`/job_invocations/${jobId}/rerun?succeeded_only=1`)}
      key="rerun-succeeded"
      isDisabled={!(succeeded > 0) || !hasPermission('create_job_invocations')}
      description="Rerun job on successful hosts"
    >
      {__('Rerun successful')}
    </DropdownItem>,
    <DropdownItem
      ouiaId="rerun-failed-dropdown-item"
      href={foremanUrl(`/job_invocations/${jobId}/rerun?failed_only=1`)}
      key="rerun-failed"
      isDisabled={!(failed > 0) || !hasPermission('create_job_invocations')}
      description="Rerun job on failed hosts"
    >
      {__('Rerun failed')}
    </DropdownItem>,
    <DropdownItem
      ouiaId="view-task-dropdown-item"
      href={foremanUrl(`/foreman_tasks/tasks/${task?.id}`)}
      key="view-task"
      isDisabled={!canViewForemanTasks || task === undefined}
      description="See details of latest task"
    >
      {__('View task')}
    </DropdownItem>,
    <DropdownSeparator ouiaId="dropdown-separator-0" key="separator-0" />,
    <DropdownItem
      ouiaId="cancel-dropdown-item"
      onClick={() => dispatch(cancelJob(jobId, false))}
      key="cancel"
      component="button"
      isDisabled={!isTaskCancelable || !hasPermission('cancel_job_invocations')}
      description="Cancel job gracefully"
    >
      {__('Cancel')}
    </DropdownItem>,
    <DropdownItem
      ouiaId="abort-dropdown-item"
      onClick={() => dispatch(cancelJob(jobId, true))}
      key="abort"
      component="button"
      isDisabled={!isTaskCancelable || !hasPermission('cancel_job_invocations')}
      description="Cancel job immediately"
    >
      {__('Abort')}
    </DropdownItem>,
    ...recurrenceDropdownItems,
    <DropdownSeparator ouiaId="dropdown-separator-2" key="separator-2" />,
    <DropdownItem
      ouiaId="legacy-ui-dropdown-item"
      href={`/job_invocations/${jobId}`}
      key="legacy-ui"
    >
      {__('Legacy UI')}
    </DropdownItem>,
  ];

  return (
    <>
      <Split hasGutter>
        <SplitItem>
          <Button
            component="a"
            ouiaId="button-create-report"
            className="button-create-report"
            href={foremanUrl(
              `/templates/report_templates/${reportTemplateJobId}/generate?${queryParams.toString()}`
            )}
            variant="secondary"
            isDisabled={
              task?.state === STATUS.PENDING ||
              templateInputId === undefined ||
              !hasPermission('generate_report_templates')
            }
          >
            {__(`Create report`)}
          </Button>
        </SplitItem>
        <SplitItem>
          <Dropdown
            ouiaId="job-invocation-global-actions-dropdown"
            onSelect={onActionSelect}
            position={DropdownPosition.right}
            toggle={
              <DropdownToggle
                ouiaId="toggle-button-action-primary"
                id={`toggle-split-button-action-primary-${jobId}`}
                splitButtonItems={[
                  <Button
                    component="a"
                    ouiaId="button-rerun-all"
                    key="rerun"
                    href={foremanUrl(`/job_invocations/${jobId}/rerun`)}
                    variant="control"
                    isDisabled={!hasPermission('create_job_invocations')}
                  >
                    {__(`Rerun all`)}
                  </Button>,
                ]}
                splitButtonVariant="action"
                onToggle={setIsActionOpen}
              />
            }
            isOpen={isActionOpen}
            dropdownItems={dropdownItems}
          />
        </SplitItem>
      </Split>
    </>
  );
};

JobInvocationToolbarButtons.propTypes = {
  jobId: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  currentPermissions: PropTypes.array,
  permissionsStatus: PropTypes.string,
};
JobInvocationToolbarButtons.defaultProps = {
  currentPermissions: undefined,
  permissionsStatus: undefined,
};

export default JobInvocationToolbarButtons;
