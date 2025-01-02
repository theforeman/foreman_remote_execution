import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Flex, FlexItem, Button } from '@patternfly/react-core';
import { APIActions } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { translate as __ } from 'foremanReact/common/I18n';

export const TemplateActionButtons = ({
  taskID,
  jobID,
  hostID,
  taskCancellable,
  permissions,
}) => {
  const dispatch = useDispatch();
  return (
    <Flex align={{ default: 'alignRight' }}>
      {permissions.execute_jobs && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <Button
            isSmall
            variant="secondary"
            isInline
            ouiaId="template-invocation-rerun-job-button"
            href={`/job_invocations/${jobID}/rerun?host_ids[]=${hostID}`}
            component="a"
            target="_blank"
          >
            {__('Rerun')}
          </Button>
        </FlexItem>
      )}
      {permissions.view_foreman_tasks && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <Button
            isSmall
            variant="secondary"
            isInline
            ouiaId="template-invocation-task-details-button"
            href={`/foreman_tasks/tasks/${taskID}`}
            component="a"
            target="_blank"
          >
            {__('Task Details')}
          </Button>
        </FlexItem>
      )}
      {permissions.cancel_job_invocations && (
        <>
          <FlexItem spacer={{ default: 'spacerXs' }}>
            <Button
              isSmall
              variant="secondary"
              isInline
              ouiaId="template-invocation-cancel-job-button"
              onClick={() => {
                dispatch(
                  addToast({
                    key: `cancel-job-info`,
                    type: 'info',
                    message: __('Trying to cancel the job'),
                  })
                );
                dispatch(
                  APIActions.post({
                    url: `/api/job_invocations/${jobID}/cancel`,
                    key: 'CANCEL_JOB',
                    errorToast: ({ response }) => response.data.message,
                    successToast: () => __('Job cancelled succesfully'),
                  })
                );
              }}
              isDisabled={!taskCancellable}
            >
              {__('Cancel Job')}
            </Button>
          </FlexItem>
          <FlexItem spacer={{ default: 'spacerXs' }}>
            <Button
              isSmall
              variant="secondary"
              isInline
              ouiaId="template-invocation-abort-job-button"
              onClick={() => {
                dispatch(
                  addToast({
                    key: `abort-job-info`,
                    type: 'info',
                    message: __('Trying to abort the job'),
                  })
                );
                dispatch(
                  APIActions.post({
                    url: `/api/job_invocations/${jobID}/cancel?force=true`,
                    key: 'ABORT_JOB',
                    errorToast: ({ response }) => response.data.message,
                    successToast: () => __('Job aborted succesfully'),
                  })
                );
              }}
              isDisabled={!taskCancellable}
            >
              {__('Abort Job')}
            </Button>
          </FlexItem>
        </>
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
