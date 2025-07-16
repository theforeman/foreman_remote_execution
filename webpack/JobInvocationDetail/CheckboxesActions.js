import {
  Button,
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
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  templateInvocationPageUrl,
  MAX_HOSTS_API_SIZE,
  DIRECT_OPEN_HOST_LIMIT,
} from './JobInvocationConstants';
import { selectTemplateInvocation } from './JobInvocationSelectors';
import OpenAllInvocationsModal, { PopupAlert } from './OpenAllInvocationsModal';

export const CheckboxesActions = ({ selectedIds, failedCount, jobID }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isOpenFailed, setIsOpenFailed] = useState(false);
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

  const ActionsKebab = () => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const dropdownItems = [
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
      <ActionsKebab />
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

CheckboxesActions.propTypes = {
  selectedIds: PropTypes.array.isRequired,
  failedCount: PropTypes.number.isRequired,
  jobID: PropTypes.string.isRequired,
};
