import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, FlexItem, Button } from '@patternfly/react-core';
import { ActionsColumn } from '@patternfly/react-table';
import { APIActions } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { translate as __ } from 'foremanReact/common/I18n';
import { selectTemplateInvocation } from '../JobInvocationSelectors';

const actions = ({
  taskID,
  jobID,
  hostID,
  taskCancellable,
  permissions,
  dispatch,
}) => ({
  rerun: {
    name: 'template-invocation-rerun-job',
    href: `/job_invocations/${jobID}/rerun?host_ids[]=${hostID}`,
    component: 'a',
    text: __('Rerun'),
    permission: permissions.execute_jobs,
  },
  details: {
    name: 'template-invocation-task-details',
    href: `/foreman_tasks/tasks/${taskID}`,
    component: 'a',
    text: __('Task Details'),
    permission: permissions.view_foreman_tasks,
  },
  cancel: {
    name: 'template-invocation-cancel-job',
    text: __('Cancel Task'),
    permission: permissions.cancel_job_invocations,
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
          errorToast: ({ response }) => response.data.message,
          successToast: () => __('Task for the host cancelled succesfully'),
        })
      );
    },
    isDisabled: !taskCancellable,
  },
  abort: {
    name: 'template-invocation-abort-job',
    text: __('Abort task'),
    permission: permissions.cancel_job_invocations,
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
          errorToast: ({ response }) => response.data.message,
          successToast: () => __('task aborted succesfully'),
        })
      );
    },
    isDisabled: !taskCancellable,
  },
});

export const RowActions = ({ hostID, jobID }) => {
  const dispatch = useDispatch();
  const response = useSelector(selectTemplateInvocation);
  if (!response?.permissions) return null;
  const {
    task_id: taskID,
    task_cancellable: taskCancellable,
    permissions,
  } = response;

  const getActions = actions({
    taskID,
    jobID,
    hostID,
    taskCancellable,
    permissions,
    dispatch,
  });

  const rowActions = Object.values(getActions)
    .map(({ text, href, permission, isDisabled }) =>
      permission
        ? {
            title: text,
            onClick: () => {
              window.open(href, '_blank');
            },
            isDisabled,
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
  permissions,
}) => {
  const dispatch = useDispatch();
  const { rerun, details, cancel, abort } = actions({
    taskID,
    jobID,
    hostID,
    taskCancellable,
    permissions,
    dispatch,
  });
  return (
    <Flex align={{ default: 'alignRight' }}>
      {rerun.permission && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <Button
            isSmall
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
            isSmall
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
            isSmall
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
            isSmall
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
  permissions: PropTypes.shape({
    view_foreman_tasks: PropTypes.bool,
    cancel_job_invocations: PropTypes.bool,
    execute_jobs: PropTypes.bool,
  }),
};

TemplateActionButtons.defaultProps = {
  taskID: null,
  taskCancellable: false,
  permissions: {
    view_foreman_tasks: false,
    cancel_job_invocations: false,
    execute_jobs: false,
  },
};

RowActions.propTypes = {
  hostID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  jobID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
