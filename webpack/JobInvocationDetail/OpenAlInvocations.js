import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertActionCloseButton,
  Button,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { OutlinedWindowRestoreIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { templateInvocationPageUrl } from './JobInvocationConstants';

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
export const OpenAlInvocations = ({ results, id, setShowAlert }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openLink = url => {
    const newWin = window.open(url);

    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      setShowAlert(true);
    }
  };
  const OpenAllButton = () => (
    <Button
      variant="link"
      isInline
      aria-label="open all template invocations in a new tab"
      ouiaId="template-invocation-new-tab-button"
      onClick={() => {
        if (results.length <= 3) {
          results.forEach(result => {
            openLink(templateInvocationPageUrl(result.id, id), '_blank');
          });
        } else {
          handleModalToggle();
        }
      }}
    >
      <OutlinedWindowRestoreIcon />
    </Button>
  );
  const OpenAllModal = () => (
    <Modal
      ouiaId="template-invocation-new-tab-modal"
      title={__('Open all invocations in new tabs')}
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      variant={ModalVariant.small}
      titleIconVariant="warning"
      actions={[
        <Button
          ouiaId="template-invocation-new-tab-modal-confirm"
          key="confirm"
          variant="primary"
          onClick={() => {
            results.forEach(result => {
              openLink(templateInvocationPageUrl(result.id, id), '_blank');
            });
            handleModalToggle();
          }}
        >
          {__('Open all in new tabs')}
        </Button>,
        <Button
          ouiaId="template-invocation-new-tab-modal-cancel"
          key="cancel"
          variant="link"
          onClick={handleModalToggle}
        >
          {__('Cancel')}
        </Button>,
      ]}
    >
      {__('Are you sure you want to open all invocations in new tabs?')}
      <br />
      {__('This will open a new tab for each invocation.')}
      <br />
      {__('The number of invocations is:')} <b>{results.length}</b>
    </Modal>
  );
  return (
    <>
      <OpenAllButton />
      <OpenAllModal />
    </>
  );
};

OpenAlInvocations.propTypes = {
  results: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  setShowAlert: PropTypes.func.isRequired,
};

PopupAlert.propTypes = {
  setShowAlert: PropTypes.func.isRequired,
};
