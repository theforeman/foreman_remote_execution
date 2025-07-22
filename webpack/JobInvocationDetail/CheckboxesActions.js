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
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  DIRECT_OPEN_HOST_LIMIT,
  templateInvocationPageUrl,
} from './JobInvocationConstants';
import {
  selectHasPermission,
  selectTaskCancelable,
} from './JobInvocationSelectors';
import OpenAllInvocationsModal from './OpenAllInvocationsModal';

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
      {sprintf(__('Open all failed runs on this page (%s)'), failedCount)}
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
  allJobs,
  jobID,
  filter,
  bulkParams,
  setShowAlert,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenFailed, setIsOpenFailed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isTaskCancelable = useSelector(selectTaskCancelable);
  const dispatch = useDispatch();
  const [toBeOpened, setToBeOpened] = useState([]);

  const hasCreatePermission = useSelector(
    selectHasPermission('create_job_invocations')
  );
  const hasCancelPermission = useSelector(
    selectHasPermission('cancel_job_invocations')
  );
  const jobSearchQuery = `job_invocation.id = ${jobID}`;
  const filterQuery =
    filter && filter !== 'all_statuses'
      ? ` and job_invocation.result = ${filter}`
      : '';
  const combinedQuery = `${bulkParams}${filterQuery}`;

  const [failedHosts, setFailedHosts] = useState([]);

  useEffect(() => {
    const failed = allJobs.filter(i => i.job_status === 'error');
    setFailedHosts(failed);
  }, [allJobs]);

  const failedCount = failedHosts.length;

  const openLink = url => {
    const newWin = window.open(url);

    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      setShowAlert(true);
    }
  };

  const openTabs = tabs => {
    tabs.forEach(open => {
      const openId = open.id ?? open;
      openLink(templateInvocationPageUrl(openId, jobID));
    });
  };

  const handleOpenHosts = async (type = 'all') => {
    if (type === 'failed') {
      if (failedCount <= DIRECT_OPEN_HOST_LIMIT) {
        openTabs(failedHosts);
        return;
      }
      setToBeOpened(failedHosts);
      setIsOpenFailed(true);
      setIsModalOpen(true);
      return;
    }

    if (selectedIds.length === 0) {
      selectedIds = allJobs;
    }

    if (selectedIds.length <= DIRECT_OPEN_HOST_LIMIT) {
      openTabs(selectedIds);
      return;
    }

    setToBeOpened(selectedIds);
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
      isDisabled={allJobs.length === 0}
      isInline
      onClick={() => handleOpenHosts('all')}
      ouiaId="template-invocation-new-tab-button"
      variant="link"
    >
      <Tooltip
        content={
          selectedIds.length === 0
            ? __('Open all rows of the table in new tabs')
            : __('Open selected in new tab')
        }
      >
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
      <OpenAllInvocationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        failedCount={failedCount}
        isOpenFailed={isOpenFailed}
        selectedIds={selectedIds}
        confirmCallback={() => openTabs(toBeOpened)}
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
  allJobs: PropTypes.array.isRequired,
  jobID: PropTypes.string.isRequired,
  bulkParams: PropTypes.string,
  filter: PropTypes.string,
  setShowAlert: PropTypes.func.isRequired,
};

CheckboxesActions.defaultProps = {
  bulkParams: '',
  filter: '',
};
