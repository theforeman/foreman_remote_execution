import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Tooltip,
} from '@patternfly/react-core';
import {
  EllipsisVIcon,
  OutlinedWindowRestoreIcon,
} from '@patternfly/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { APIActions } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import OpenAllInvocationsModal, { PopupAlert } from './OpenAllInvocationsModal';
import {
  selectTaskCancelable,
  selectTemplateInvocation,
} from './JobInvocationSelectors';
import {
  DIRECT_OPEN_HOST_LIMIT,
  MAX_HOSTS_API_SIZE,
  templateInvocationPageUrl,
  hasPermission,
} from './JobInvocationConstants';

const ActionsKebab = ({
  selectedIds,
  failedCount,
  isTaskCancelable,
  permissions,
  handleTaskAction,
  handleOpenHosts,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const dropdownItems = [
    <DropdownItem
      ouiaId="cancel-host-dropdown-item"
      onClick={() => handleTaskAction('cancel')}
      key="cancel"
      component="button"
      isDisabled={
        selectedIds.length === 0 ||
        !isTaskCancelable ||
        !hasPermission(permissions, 'cancel_job_invocations')
      }
    >
      {__('Cancel selected test')}
    </DropdownItem>,
    <DropdownItem
      ouiaId="abort-host-dropdown-item"
      onClick={() => handleTaskAction('abort')}
      key="abort"
      component="button"
      isDisabled={
        selectedIds.length === 0 ||
        !isTaskCancelable ||
        !hasPermission(permissions, 'cancel_job_invocations')
      }
    >
      {__('Abort selected')}
    </DropdownItem>,
    <Divider component="li" key="separator" />,
    <DropdownItem
      ouiaId="open-failed-dropdown-item"
      key="open-failed"
      onClick={() => handleOpenHosts('failed')}
      isDisabled={failedCount === 0}
    >
      {sprintf(__('Open all failed runs (%s)'), failedCount)}
    </DropdownItem>,
  ];

  return (
    <Dropdown
      isOpen={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      onSelect={() => setIsDropdownOpen(false)}
      ouiaId="actions-kebab"
      shouldFocusToggleOnSelect
      toggle={toggleRef => (
        <MenuToggle
          aria-label="actions dropdown toggle"
          id="toggle-kebab"
          isExpanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen(prev => !prev)}
          ref={toggleRef}
          variant="plain"
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};

export const CheckboxesActions = ({
  selectedIds,
  failedCount,
  jobID,
  filter,
  bulkParams,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isOpenFailed, setIsOpenFailed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isTaskCancelable = useSelector(selectTaskCancelable);
  const dispatch = useDispatch();
  const permissions = useSelector(
    state => selectTemplateInvocation(state)?.permissions
  );

  const { response: failedHostsData } = useAPI(
    'get',
    foremanUrl(`/api/job_invocations/${jobID}/hosts`),
    {
      params: {
        per_page: MAX_HOSTS_API_SIZE,
        search: `job_invocation.result = failed`,
      },
      skip: failedCount === 0,
    }
  );

  const failedHosts = failedHostsData?.results || [];

  const openLink = url => {
    const newWin = window.open(url);

    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      setShowAlert(true);
    }
  };

  const handleOpenHosts = async (type = 'all') => {
    if (type === 'failed') {
      if (failedCount <= DIRECT_OPEN_HOST_LIMIT) {
        failedHosts.forEach(host =>
          openLink(templateInvocationPageUrl(host.id, jobID))
        );
        return;
      }
      setIsOpenFailed(true);
      setIsModalOpen(true);
      return;
    }

    if (selectedIds.length <= DIRECT_OPEN_HOST_LIMIT) {
      selectedIds.forEach(id => openLink(templateInvocationPageUrl(id, jobID)));
      return;
    }

    setIsOpenFailed(false);
    setIsModalOpen(true);
  };

  const filterQuery =
    filter && filter !== 'all_statuses'
      ? ` and job_invocation.result = ${filter}`
      : '';
  const combinedQuery = `${bulkParams}${filterQuery}`;

  const handleTaskAction = action => {
    dispatch(
      addToast({
        key: `cancel-job-info`,
        type: 'info',
        message: sprintf(__('Trying to %s the task for the host'), action),
      })
    );

    dispatch(
      APIActions.post({
        url: `/api/v2/job_invocations/${jobID}/cancel`,
        key: 'CANCEL_JOB_TASKS_BY_SEARCH',
        params: {
          search: combinedQuery,
          force: action !== 'cancel',
        },
        errorToast: ({ response }) => response?.data?.error,
        successToast: response => {
          const cancelledTasks = response?.data?.cancelled;
          const cancelledCount = cancelledTasks?.length;
          const pastTenseAction =
            action === 'cancel' ? __('cancelled') : __('aborted');
          if (cancelledCount > 0) {
            const idList = cancelledTasks.join(', ');

            return sprintf(
              __('%s task(s) successfully %s: %s'),
              cancelledCount,
              pastTenseAction,
              idList
            );
          }
          return sprintf(__('Task(s) were not %s'), pastTenseAction);
        },
      })
    );
  };

  const OpenAllButton = () => (
    <Button
      aria-label="open all template invocations in new tab"
      className="open-all-button"
      isDisabled={selectedIds.length === 0}
      isInline
      onClick={() => handleOpenHosts('all')}
      ouiaId="template-invocation-new-tab-button"
      variant="link"
    >
      <Tooltip content={__('Open selected in new tab')}>
        <OutlinedWindowRestoreIcon />
      </Tooltip>
    </Button>
  );

  const searchParams = new URLSearchParams();
  selectedIds.forEach(id => searchParams.append('host_ids[]', id));

  const RerunSelectedButton = () => (
    <Button
      aria-label="rerun selected template invocations"
      className="rerun-selected-button"
      component="a"
      href={foremanUrl(
        `/job_invocations/${jobID}/rerun?${searchParams.toString()}`
      )}
      // eslint-disable-next-line camelcase
      isDisabled={selectedIds.length === 0 || !permissions?.execute_jobs}
      isInline
      ouiaId="template-invocation-rerun-selected-button"
      variant="secondary"
    >
      {__('Rerun')}
    </Button>
  );

  return (
    <>
      <OpenAllButton />
      <RerunSelectedButton />
      <ActionsKebab
        selectedIds={selectedIds}
        failedCount={failedCount}
        isTaskCancelable={isTaskCancelable}
        permissions={permissions}
        handleTaskAction={handleTaskAction}
        handleOpenHosts={handleOpenHosts}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      {showAlert && <PopupAlert setShowAlert={setShowAlert} />}
      <OpenAllInvocationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        failedCount={failedCount}
        failedHosts={failedHosts}
        jobID={jobID}
        isOpenFailed={isOpenFailed}
        setShowAlert={setShowAlert}
        selectedIds={selectedIds}
      />
    </>
  );
};

ActionsKebab.propTypes = {
  selectedIds: PropTypes.array.isRequired,
  failedCount: PropTypes.number.isRequired,
  isTaskCancelable: PropTypes.bool,
  permissions: PropTypes.object,
  handleTaskAction: PropTypes.func.isRequired,
  handleOpenHosts: PropTypes.func.isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
  setIsDropdownOpen: PropTypes.func.isRequired,
};

ActionsKebab.defaultProps = {
  isTaskCancelable: false,
  permissions: {},
};

CheckboxesActions.propTypes = {
  selectedIds: PropTypes.array.isRequired,
  failedCount: PropTypes.number.isRequired,
  jobID: PropTypes.string.isRequired,
  bulkParams: PropTypes.string,
  filter: PropTypes.string,
};

CheckboxesActions.defaultProps = {
  bulkParams: '',
  filter: '',
};
