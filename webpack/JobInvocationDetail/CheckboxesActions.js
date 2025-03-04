import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core';
import { useDispatch, useSelector } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';
import { APIActions } from 'foremanReact/redux/API';
import { selectTaskCancelable } from './JobInvocationSelectors';
import { hasPermission } from './JobInvocationConstants';

export const CheckboxesActions = ({
  jobID,
  allHostsIds,
  bulkParams,
  selectedCount,
  isAllSelected,
  currentPermissions,
  permissionsStatus,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isTaskCancelable = useSelector(selectTaskCancelable);
  const dispatch = useDispatch();

  const getIdsArray = () => {
    if (!bulkParams) {
      return isAllSelected ? allHostsIds : [];
    }
    // bulkParams in format `id ^ (1,2,3)`
    const includeIdsMatch = bulkParams.match(/id \^ \(([^)]+)\)/);
    if (includeIdsMatch) {
      return includeIdsMatch[1].split(',').map(id => id.trim());
    }
    // bulkParams in format `id !^ (1,2,3)`
    const excludeIdsMatch = bulkParams.match(/id !\^ \(([^)]+)\)/);
    if (excludeIdsMatch) {
      const excludedIds = excludeIdsMatch[1]
        .split(',')
        .map(id => Number(id.trim()));
      return allHostsIds.filter(id => !excludedIds.includes(id));
    }
    return [];
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-kebab');
    element.focus();
  };
  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };
  const idsArray = getIdsArray();
  console.log('idsArray ', idsArray);

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
            errorToast: ({ responseError }) => responseError.data.message,
            successToast: () =>
              action === 'cancel'
                ? __(`Task for the host cancelled successfully`)
                : __(`Task for the host aborted successfully`),
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
    </>
  );
};

CheckboxesActions.propTypes = {
  jobID: PropTypes.string.isRequired,
  allHostsIds: PropTypes.array.isRequired,
  bulkParams: PropTypes.string,
  selectedCount: PropTypes.number.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  currentPermissions: PropTypes.array,
  permissionsStatus: PropTypes.string,
};

CheckboxesActions.defaultProps = {
  bulkParams: undefined,
  currentPermissions: [],
  permissionsStatus: undefined,
};
