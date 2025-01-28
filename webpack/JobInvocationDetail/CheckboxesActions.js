import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  KebabToggle,
} from '@patternfly/react-core';
import { useDispatch, useSelector } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';
import { APIActions } from 'foremanReact/redux/API';
import { selectTaskCancelable } from './JobInvocationSelectors';
import { openLink, useModalToggle, OpenAllModal } from './OpenAllHelpers';
import { hasPermission } from './JobInvocationConstants';

export const CheckboxesActions = ({
  jobID,
  bulkParams,
  selectedCount,
  currentPermissions,
  permissionsStatus,
  failedHosts,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isTaskCancelable = useSelector(selectTaskCancelable);
  const dispatch = useDispatch();
  const { isModalOpen, handleModalToggle } = useModalToggle();
  const idsArray = bulkParams
    ?.match(/\(([^)]+)\)/)?.[1]
    ?.split(',')
    .map(id => id.trim());

  const onFocus = () => {
    const element = document.getElementById('toggle-kebab');
    element.focus();
  };
  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const getRerunUrl = () =>
    idsArray?.length
      ? `/job_invocations/${jobID}/rerun?${idsArray
          .map(id => `host_ids[]=${id}`)
          .join('&')}`
      : null;

  const handleTaskAction = action => {
    if (idsArray) {
      idsArray.forEach(taskID => {
        dispatch(
          addToast({
            key: `${action}-job-info-${taskID}`,
            type: 'info',
            message: __(`Trying to ${action} the task for the host`),
          })
        );

        dispatch(
          APIActions.post({
            url: `/foreman_tasks/tasks/${taskID}/${action}`,
            key: `${action.toUpperCase()}_TASK_${taskID}`,
            errorToast: ({ response }) => response.data.message,
            successToast: () =>
              __(
                `Task for the host ${
                  action === 'cancel' ? 'cancelled' : 'aborted'
                } successfully`
              ),
          })
        );
      });
    }
  };

  const RerunButton = () => (
    <Button
      ouiaId="template-invocation-new-tab-button"
      href={getRerunUrl()}
      variant="secondary"
      component="a"
      isDisabled={
        selectedCount === 0 ||
        !hasPermission(
          currentPermissions,
          permissionsStatus,
          'create_job_invocations'
        )
      }
    >
      {__('Rerun')}
    </Button>
  );

  const dropdownItems = [
    <DropdownItem
      ouiaId="cancel-host-dropdown-item"
      onClick={() => handleTaskAction('cancel')}
      key="cancel"
      component="button"
      isDisabled={
        selectedCount === 0 ||
        !isTaskCancelable ||
        !hasPermission(
          currentPermissions,
          permissionsStatus,
          'cancel_job_invocations'
        )
      }
    >
      {__('Cancel')}
    </DropdownItem>,
    <DropdownItem
      ouiaId="abort-host-dropdown-item"
      onClick={() => handleTaskAction('abort')}
      key="abort"
      component="button"
      isDisabled={
        selectedCount === 0 ||
        !isTaskCancelable ||
        !hasPermission(
          currentPermissions,
          permissionsStatus,
          'cancel_job_invocations'
        )
      }
    >
      {__('Abort')}
    </DropdownItem>,
    <DropdownSeparator ouiaId="dropdown-separator" key="separator" />,
    <DropdownItem
      ouiaId="open-failed-host-dropdown-item"
      key="open-failed"
      component="button"
      isDisabled={failedHosts.length === 0}
      onClick={() => {
        if (failedHosts.length <= 3) {
          failedHosts.forEach(id =>
            openLink(`/job_invocations/${id}`, () => {})
          );
        } else {
          handleModalToggle();
        }
      }}
    >
      {__('Open all failed runs')}
    </DropdownItem>,
  ];

  const ActionsKebab = () => (
    <Dropdown
      ouiaId="host-actions-dropdown-kebab"
      onSelect={onSelect}
      toggle={<KebabToggle id="toggle-kebab" onToggle={setIsOpen} />}
      isOpen={isOpen}
      isPlain
      dropdownItems={dropdownItems}
    />
  );

  return (
    <>
      <RerunButton />
      <ActionsKebab />
      <OpenAllModal
        isModalOpen={isModalOpen}
        handleModalToggle={handleModalToggle}
        hosts={failedHosts}
        jobID={jobID}
        onConfirm={url => openLink(url, () => {})}
      />
    </>
  );
};

CheckboxesActions.propTypes = {
  jobID: PropTypes.string.isRequired,
  bulkParams: PropTypes.string,
  selectedCount: PropTypes.number.isRequired,
  currentPermissions: PropTypes.array,
  failedHosts: PropTypes.array,
  permissionsStatus: PropTypes.string,
};

CheckboxesActions.defaultProps = {
  bulkParams: undefined,
  currentPermissions: [],
  failedHosts: [],
  permissionsStatus: undefined,
};
