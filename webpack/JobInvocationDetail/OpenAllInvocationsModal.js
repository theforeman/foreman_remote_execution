import {
  Alert,
  AlertActionCloseButton,
  Button,
  Modal,
} from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';
import React from 'react';
import {
  templateInvocationPageUrl,
  MAX_HOSTS_API_SIZE,
} from './JobInvocationConstants';

export const PopupAlert = ({ setShowAlert }) => (
  <Alert
    ouiaId="template-invocation-new-tab-popup-alert"
    variant="warning"
    actionClose={<AlertActionCloseButton onClose={() => setShowAlert(false)} />}
    title={__(
      'Popups are blocked by your browser. Please allow popups for this site to open all invocations in new tabs.'
    )}
  />
);

const OpenAllInvocationsModal = ({
  failedCount,
  failedHosts,
  isOpen,
  isOpenFailed,
  jobID,
  onClose,
  setShowAlert,
  selectedIds,
}) => {
  const modalText = isOpenFailed ? 'failed' : 'selected';

  const openLink = url => {
    const newWin = window.open(url);
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      setShowAlert(true);
    }
  };

  return (
    <Modal
      className="open-all-modal"
      isOpen={isOpen}
      onClose={onClose}
      ouiaId="template-invocation-new-tab-modal"
      title={sprintf(__('Open all %s invocations in new tabs'), modalText)}
      titleIconVariant="warning"
      width={590}
      actions={[
        <Button
          ouiaId="template-invocation-new-tab-modal-confirm"
          key="confirm"
          variant="primary"
          onClick={() => {
            const hostsToOpen = isOpenFailed
              ? failedHosts
              : selectedIds.map(id => ({ id }));

            hostsToOpen
              .slice(0, MAX_HOSTS_API_SIZE)
              .forEach(({ id }) =>
                openLink(templateInvocationPageUrl(id, jobID), '_blank')
              );

            onClose();
          }}
        >
          {__('Open in new tabs')}
        </Button>,
        <Button
          ouiaId="template-invocation-new-tab-modal-cancel"
          key="cancel"
          variant="link"
          onClick={onClose}
        >
          {__('Cancel')}
        </Button>,
      ]}
    >
      {sprintf(
        __('Are you sure you want to open all %s invocations in new tabs?'),
        modalText
      )}
      <br />
      {__('This will open a new tab for each invocation. The maximum is 100.')}
      <br />
      {sprintf(__('The number of %s invocations is:'), modalText)}{' '}
      <b>{isOpenFailed ? failedCount : selectedIds.length}</b>
    </Modal>
  );
};

OpenAllInvocationsModal.propTypes = {
  failedCount: PropTypes.number.isRequired,
  failedHosts: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  isOpenFailed: PropTypes.bool,
  jobID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  selectedIds: PropTypes.array.isRequired,
};

OpenAllInvocationsModal.defaultProps = {
  failedHosts: [],
  isOpenFailed: false,
};

PopupAlert.propTypes = {
  setShowAlert: PropTypes.func.isRequired,
};

export default OpenAllInvocationsModal;
