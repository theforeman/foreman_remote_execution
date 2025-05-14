import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Tooltip,
} from '@patternfly/react-core';
import { OutlinedWindowRestoreIcon } from '@patternfly/react-icons';
import EllipsisVIcon from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon';
import axios from 'axios';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getIdsArray,
  templateInvocationPageUrl,
} from './JobInvocationConstants';
import { selectTemplateInvocation } from './JobInvocationSelectors';
import OpenAllInvocationsModal, { PopupAlert } from './OpenAllInvocationsModal';

export const CheckboxesActions = ({
  allHostsIds,
  areAllRowsSelected,
  bulkParams,
  failedCount,
  isAllSelected,
  jobID,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isOpenFailed, setIsOpenFailed] = useState(false);
  const idsArray = getIdsArray(bulkParams, allHostsIds, isAllSelected);
  const permissions = useSelector(
    state => selectTemplateInvocation(state)?.permissions
  );

  const openLink = url => {
    const newWin = window.open(url);

    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      setShowAlert(true);
    }
  };

  const fetchFailedHosts = async () => {
    const { data } = await axios.get(
      foremanUrl(`/api/job_invocations/${jobID}/hosts`),
      {
        params: {
          per_page: 100,
          search: `job_invocation.result = failed`,
        },
      }
    );
    return data?.results || [];
  };

  const handleOpenHosts = async (type = 'all') => {
    if (type === 'failed') {
      if (failedCount <= 3) {
        const fetchedHosts = await fetchFailedHosts();
        fetchedHosts.forEach(host =>
          openLink(templateInvocationPageUrl(host.id, jobID))
        );
        return;
      }
      setIsOpenFailed(true);
      setIsModalOpen(true);
      return;
    }

    // type === 'all'
    if (idsArray.length <= 3) {
      idsArray.forEach(id => openLink(templateInvocationPageUrl(id, jobID)));
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
        isDisabled={failedCount.length === 0}
      >
        {__(`Open all failed runs (${failedCount})`)}
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
      isDisabled={idsArray.length === 0}
      isInline
      onClick={() => handleOpenHosts('all')}
      ouiaId="template-invocation-new-tab-button"
      variant="link"
    >
      <Tooltip content="Open selected in new tab">
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
        `/job_invocations/${jobID}/rerun?${idsArray
          .map(id => `host_ids[]=${id}`)
          .join('&')}`
      )}
      // eslint-disable-next-line camelcase
      isDisabled={idsArray.length === 0 || !permissions?.execute_jobs}
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
        allHostsIds={idsArray}
        bulkParams={bulkParams}
        failedCount={failedCount}
        fetchFailedHosts={fetchFailedHosts}
        jobID={jobID}
        isAllSelected={areAllRowsSelected}
        isOpenFailed={isOpenFailed}
        setShowAlert={setShowAlert}
      />
    </>
  );
};

CheckboxesActions.propTypes = {
  allHostsIds: PropTypes.array.isRequired,
  areAllRowsSelected: PropTypes.bool,
  bulkParams: PropTypes.string,
  failedCount: PropTypes.number.isRequired,
  jobID: PropTypes.string.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
};

CheckboxesActions.defaultProps = {
  areAllRowsSelected: false,
  bulkParams: '',
};
