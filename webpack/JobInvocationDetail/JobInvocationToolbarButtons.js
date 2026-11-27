import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { usePermissions } from 'foremanReact/common/hooks/Permissions/permissionHooks';
import {
  cancelJob,
  cancelRecurringLogic,
  enableRecurringLogic,
} from './JobInvocationActions';
import { STATUS } from './JobInvocationConstants';
import { selectTaskCancelable } from './JobInvocationSelectors';

const JobInvocationToolbarButtons = ({ jobId, data }) => {
  const { succeeded, failed, task, recurrence, permissions } = data;
  const recurringEnabled = recurrence?.state === 'active';
  const canViewForemanTasks = permissions
    ? permissions.view_foreman_tasks
    : false;
  const canEditRecurringLogic = permissions
    ? permissions.edit_recurring_logics
    : false;
  const isTaskCancelable = useSelector(selectTaskCancelable);
  const canCreateJobInvocations = usePermissions(['create_job_invocations']);
  const canCancelJobInvocations = usePermissions(['cancel_job_invocations']);
  const canGenerateReportTemplates = usePermissions([
    'generate_report_templates',
  ]);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const dispatch = useDispatch();
  const reportHref = foremanUrl(`/job_invocations/${jobId}/report`);

  const isCreateReportDisabled =
    !canGenerateReportTemplates ||
    task?.state === STATUS.RUNNING ||
    task?.state === STATUS.PENDING;

  const onActionFocus = useCallback(() => {
    const element = document.getElementById(
      `toggle-split-button-action-primary-${jobId}`
    );
    if (element) {
      element.focus();
    }
  }, [jobId]);
  const onActionSelect = useCallback(() => {
    setIsActionOpen(false);
    onActionFocus();
  }, [onActionFocus]);
  const recurrenceDropdownItems = useMemo(
    () =>
      recurrence
        ? [
            <Divider
              component="li"
              ouiaId="dropdown-separator-1"
              key="separator-1"
            />,
            <DropdownItem
              ouiaId="change-enabled-recurring-dropdown-item"
              onClick={() =>
                dispatch(enableRecurringLogic(recurrence?.id, recurringEnabled))
              }
              key="change-enabled-recurring"
              component="button"
              isDisabled={
                recurrence?.id === undefined ||
                recurrence?.state === 'cancelled' ||
                !canEditRecurringLogic
              }
            >
              {recurringEnabled
                ? __('Disable recurring')
                : __('Enable recurring')}
            </DropdownItem>,
            <DropdownItem
              ouiaId="cancel-recurring-dropdown-item"
              onClick={() => dispatch(cancelRecurringLogic(recurrence?.id))}
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
        : [],
    [recurrence, recurringEnabled, canEditRecurringLogic, dispatch]
  );

  const dropdownItems = useMemo(
    () => [
      <DropdownItem
        ouiaId="rerun-succeeded-dropdown-item"
        to={foremanUrl(`/job_invocations/${jobId}/rerun?succeeded_only=1`)}
        key="rerun-succeeded"
        isDisabled={!canCreateJobInvocations || !(succeeded > 0)}
        description={__('Rerun job on successful hosts')}
      >
        {__('Rerun successful')}
      </DropdownItem>,
      <DropdownItem
        ouiaId="rerun-failed-dropdown-item"
        to={foremanUrl(`/job_invocations/${jobId}/rerun?failed_only=1`)}
        key="rerun-failed"
        isDisabled={!canCreateJobInvocations || !(failed > 0)}
        description={__('Rerun job on failed hosts')}
      >
        {__('Rerun failed')}
      </DropdownItem>,
      <DropdownItem
        ouiaId="view-task-dropdown-item"
        to={foremanUrl(`/foreman_tasks/tasks/${task?.id}`)}
        key="view-task"
        isDisabled={!canViewForemanTasks || task === undefined}
        description={__('See details of latest task')}
      >
        {__('View task')}
      </DropdownItem>,
      <Divider
        component="li"
        ouiaId="dropdown-separator-0"
        key="separator-0"
      />,
      <DropdownItem
        ouiaId="cancel-dropdown-item"
        onClick={() => dispatch(cancelJob(jobId, false))}
        key="cancel"
        component="button"
        isDisabled={!canCancelJobInvocations || !isTaskCancelable}
        description={__('Cancel job gracefully')}
      >
        {__('Cancel')}
      </DropdownItem>,
      <DropdownItem
        ouiaId="abort-dropdown-item"
        onClick={() => dispatch(cancelJob(jobId, true))}
        key="abort"
        component="button"
        isDisabled={!canCancelJobInvocations || !isTaskCancelable}
        description={__('Cancel job immediately')}
      >
        {__('Abort')}
      </DropdownItem>,
      ...recurrenceDropdownItems,
    ],
    [
      canCancelJobInvocations,
      canCreateJobInvocations,
      canViewForemanTasks,
      dispatch,
      failed,
      isTaskCancelable,
      jobId,
      recurrenceDropdownItems,
      succeeded,
      task,
    ]
  );

  return (
    <>
      <Split hasGutter>
        <SplitItem>
          <Button
            component="a"
            ouiaId="button-create-report"
            href={reportHref}
            variant="secondary"
            isDisabled={isCreateReportDisabled}
          >
            {__('Create report')}
          </Button>
        </SplitItem>
        <SplitItem>
          <Dropdown
            ouiaId="job-invocation-global-actions-dropdown"
            onSelect={onActionSelect}
            onOpenChange={setIsActionOpen}
            isOpen={isActionOpen}
            popperProps={{ position: 'right' }}
            toggle={toggleRef => (
              <MenuToggle
                ref={toggleRef}
                ouiaId="toggle-button-action-primary"
                id={`toggle-split-button-action-primary-${jobId}`}
                isExpanded={isActionOpen}
                onClick={() => setIsActionOpen(prev => !prev)}
                aria-label={__('Select')}
                splitButtonItems={[
                  <Button
                    component="a"
                    ouiaId="button-rerun-all"
                    key="rerun"
                    href={foremanUrl(`/job_invocations/${jobId}/rerun`)}
                    variant="control"
                    isDisabled={!canCreateJobInvocations}
                  >
                    {__('Rerun all')}
                  </Button>,
                ]}
              />
            )}
          >
            <DropdownList>{dropdownItems}</DropdownList>
          </Dropdown>
        </SplitItem>
      </Split>
    </>
  );
};

JobInvocationToolbarButtons.propTypes = {
  jobId: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default JobInvocationToolbarButtons;
