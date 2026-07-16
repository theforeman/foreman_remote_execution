import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, FlexItem, Button } from '@patternfly/react-core';
import { ActionsColumn } from '@patternfly/react-table';
import { APIActions } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { translate as __ } from 'foremanReact/common/I18n';
import { usePermissions } from 'foremanReact/common/hooks/Permissions/permissionHooks';
import { selectTemplateInvocationList } from '../JobInvocationSelectors';
import './index.scss';

const actions = ({
  taskID,
  jobID,
  hostID,
  taskCancellable,
  canExecuteJobs,
  canViewForemanTasks,
  canCancelJobInvocations,
  dispatch,
}) => ({
  rerun: {
    name: 'template-invocation-rerun-job',
    href: `/job_invocations/${jobID}/rerun?host_ids[]=${hostID}`,
    component: 'a',
    text: __('Rerun'),
    permission: canExecuteJobs,
  },
  details: {
    name: 'template-invocation-task-details',
    href: `/foreman_tasks/tasks/${taskID}`,
    component: 'a',
    text: __('Task Details'),
    permission: canViewForemanTasks,
  },
  cancel: {
    name: 'template-invocation-cancel-job',
    text: __('Cancel Task'),
    permission: canCancelJobInvocations,
    onClick: () => {
      dispatch(
        addToast({
          key: `cancel-job-info`,
          type: 'info',
          message: __('Trying to cancel the task for the host'),
        })
      );
      dispatch(
        APIActions.post({
          url: `/foreman_tasks/tasks/${taskID}/cancel`,
          key: 'CANCEL_TASK',
          errorToast: ({ response }) =>
            response?.data?.message || __('Could not cancel the task'),
          successToast: () => __('Task for the host cancelled succesfully'),
        })
      );
    },
    isDisabled: !taskCancellable,
  },
  abort: {
    name: 'template-invocation-abort-job',
    text: __('Abort task'),
    permission: canCancelJobInvocations,
    onClick: () => {
      dispatch(
        addToast({
          key: `abort-job-info`,
          type: 'info',
          message: __('Trying to abort the task for the host'),
        })
      );
      dispatch(
        APIActions.post({
          url: `/foreman_tasks/tasks/${taskID}/abort`,
          key: 'ABORT_TASK',
          errorToast: ({ response }) =>
            response?.data?.message || __('Could not abort the task'),
          successToast: () => __('task aborted succesfully'),
        })
      );
    },
    isDisabled: !taskCancellable,
  },
});

export const RowActions = ({ hostID, jobID }) => {
  const dispatch = useDispatch();
  const canExecuteJobs = usePermissions(['execute_jobs']);
  const canViewForemanTasks = usePermissions(['view_foreman_tasks']);
  const canCancelJobInvocations = usePermissions(['cancel_job_invocations']);
  const response = useSelector(selectTemplateInvocationList)?.[hostID];
  if (!response) return null;
  const { task } = response;
  const { id: taskID, cancellable: taskCancellable } = task || {};
  const getActions = actions({
    taskID,
    jobID,
    hostID,
    taskCancellable,
    canExecuteJobs,
    canViewForemanTasks,
    canCancelJobInvocations,
    dispatch,
  });

  const rowActions = Object.values(getActions)
    .map(({ text, href, onClick, permission, isDisabled }) =>
      permission
        ? {
            title: <a href={href}>{text}</a>,
            onClick,
            isDisabled,
            className: 'jobs-table-action-item',
          }
        : null
    )
    .filter(Boolean);

  return <ActionsColumn items={rowActions} />;
};

export const TemplateActionButtons = ({
  taskID,
  jobID,
  hostID,
  taskCancellable,
}) => {
  const dispatch = useDispatch();
  const canExecuteJobs = usePermissions(['execute_jobs']);
  const canViewForemanTasks = usePermissions(['view_foreman_tasks']);
  const canCancelJobInvocations = usePermissions(['cancel_job_invocations']);
  const { rerun, details, cancel, abort } = actions({
    taskID,
    jobID,
    hostID,
    taskCancellable,
    canExecuteJobs,
    canViewForemanTasks,
    canCancelJobInvocations,
    dispatch,
  });
  return (
    <Flex align={{ default: 'alignRight' }}>
      {rerun.permission && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <Button
            size="sm"
            variant="secondary"
            isInline
            ouiaId={rerun.name}
            href={rerun.href}
            component="a"
            target="_blank"
          >
            {rerun.text}
          </Button>
        </FlexItem>
      )}
      {details.permission && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <Button
            size="sm"
            variant="secondary"
            isInline
            ouiaId={details.name}
            href={details.href}
            component="a"
            target="_blank"
          >
            {details.text}
          </Button>
        </FlexItem>
      )}
      {cancel.permission && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <Button
            size="sm"
            variant="danger"
            isInline
            ouiaId={cancel.name}
            onClick={cancel.onClick}
            isDisabled={cancel.isDisabled}
          >
            {cancel.text}
          </Button>
        </FlexItem>
      )}
      {abort.permission && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <Button
            size="sm"
            variant="danger"
            isInline
            ouiaId={abort.name}
            onClick={abort.onClick}
            isDisabled={abort.isDisabled}
          >
            {abort.text}
          </Button>
        </FlexItem>
      )}
    </Flex>
  );
};
TemplateActionButtons.propTypes = {
  taskID: PropTypes.string,
  jobID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hostID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  taskCancellable: PropTypes.bool,
};

TemplateActionButtons.defaultProps = {
  taskID: null,
  taskCancellable: false,
};

RowActions.propTypes = {
  hostID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  jobID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
