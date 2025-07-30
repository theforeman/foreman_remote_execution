/* eslint-disable max-lines */
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
import axios from 'axios';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  DIRECT_OPEN_HOST_LIMIT,
  MAX_HOSTS_API_SIZE,
  templateInvocationPageUrl,
} from './JobInvocationConstants';
import {
  selectHasPermission,
  selectItems,
  selectTaskCancelable,
} from './JobInvocationSelectors';
import OpenAllInvocationsModal, { PopupAlert } from './OpenAllInvocationsModal';

/* eslint-disable camelcase */
const ActionsKebab = ({
  selectedIds,
  failedCount,
  isTaskCancelable,
  hasCancelPermission,
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
        selectedIds.length === 0 || !isTaskCancelable || !hasCancelPermission
      }
    >
      {__('Cancel selected')}
    </DropdownItem>,
    <DropdownItem
      ouiaId="abort-host-dropdown-item"
      onClick={() => handleTaskAction('abort')}
      key="abort"
      component="button"
      isDisabled={
        selectedIds.length === 0 || !isTaskCancelable || !hasCancelPermission
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

  const hasCreatePermission = useSelector(
    selectHasPermission('create_job_invocations')
  );
  const hasCancelPermission = useSelector(
    selectHasPermission('cancel_job_invocations')
  );
  const jobSearchQuery = useSelector(selectItems)?.targeting?.search_query;
  const filterQuery =
    filter && filter !== 'all_statuses'
      ? ` and job_invocation.result = ${filter}`
      : '';
  const combinedQuery = `${bulkParams}${filterQuery}`;

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

  const cancelJobTasks = (search, action) => async () => {
    dispatch(
      addToast({
        key: `cancel-job-info`,
        type: 'info',
        message: sprintf(__('Trying to %s the task'), action),
      })
    );

    try {
      const response = await axios.post(
        `/api/v2/job_invocations/${jobID}/cancel`,
        {
          search,
          force: action !== 'cancel',
        }
      );

      const cancelledTasks = response.data?.cancelled;
      const pastTenseAction =
        action === 'cancel' ? __('cancelled') : __('aborted');

      if (cancelledTasks && cancelledTasks.length > 0) {
        const idList = cancelledTasks.join(', ');
        dispatch(
          addToast({
            key: `success-tasks-cancelled`,
            type: 'success',
            message: sprintf(
              __('%s task(s) successfully %s: %s'),
              cancelledTasks.length,
              pastTenseAction,
              idList
            ),
          })
        );
      } else {
        dispatch(
          addToast({
            key: `warn-no-tasks-cancelled-${Date.now()}`,
            type: 'warning',
            message: sprintf(__('Task(s) were not %s'), pastTenseAction),
          })
        );
      }
    } catch (error) {
      dispatch(
        addToast({
          key: `error-cancelling-tasks`,
          type: 'danger',
          message: error.response?.data?.error || __('An error occurred.'),
        })
      );
    }
  };

  const handleTaskAction = action => {
    dispatch(cancelJobTasks(combinedQuery, action));
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

  const RerunSelectedButton = () => (
    <Button
      aria-label="rerun selected template invocations"
      className="rerun-selected-button"
      component="a"
      href={foremanUrl(
        `/job_invocations/${jobID}/rerun?search=(${jobSearchQuery}) AND (${combinedQuery})`
      )}
      // eslint-disable-next-line camelcase
      isDisabled={selectedIds.length === 0 || !hasCreatePermission}
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
        hasCancelPermission={hasCancelPermission}
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
  hasCancelPermission: PropTypes.bool,
  handleTaskAction: PropTypes.func.isRequired,
  handleOpenHosts: PropTypes.func.isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
  setIsDropdownOpen: PropTypes.func.isRequired,
};

ActionsKebab.defaultProps = {
  isTaskCancelable: false,
  hasCancelPermission: false,
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
