import {
  Alert,
  AlertActionCloseButton,
  Button,
  Modal,
} from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';
import React from 'react';

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
  isOpen,
  isOpenFailed,
  onClose,
  selectedIds,
  confirmCallback,
}) => {
  const modalText = () => {
    if (isOpenFailed) return 'failed';
    if (selectedIds.length > 0) return 'selected';
    return 'current page';
  };

  const selectedText = () => {
    if (isOpenFailed) {
      return (
        <>
          {__('The number of failed invocations is:')} <b>{failedCount}</b>
        </>
      );
    }
    if (selectedIds.length > 0) {
      return (
        <>
          {__('The number of selected invocations is:')}{' '}
          <b>{selectedIds.length}</b>
        </>
      );
    }
    return <></>;
  };

  return (
    <Modal
      className="open-all-modal"
      isOpen={isOpen}
      onClose={onClose}
      ouiaId="template-invocation-new-tab-modal"
      title={sprintf(__('Open all %s invocations in new tabs'), modalText())}
      titleIconVariant="warning"
      width={590}
      actions={[
        <Button
          ouiaId="template-invocation-new-tab-modal-confirm"
          key="confirm"
          variant="primary"
          onClick={() => {
            confirmCallback();
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
        modalText()
      )}
      <br />
      {selectedText()}
    </Modal>
  );
};

OpenAllInvocationsModal.propTypes = {
  failedCount: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenFailed: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  selectedIds: PropTypes.array.isRequired,
  confirmCallback: PropTypes.func.isRequired,
};

OpenAllInvocationsModal.defaultProps = {
  isOpenFailed: false,
};

PopupAlert.propTypes = {
  setShowAlert: PropTypes.func.isRequired,
};

export default OpenAllInvocationsModal;
