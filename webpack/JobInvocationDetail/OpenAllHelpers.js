import React from 'react';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { templateInvocationPageUrl } from './JobInvocationConstants';

export const useModalToggle = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  return { isModalOpen, handleModalToggle };
};

export const openLink = (url, setShowAlert) => {
  const newWin = window.open(url);

  if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
    setShowAlert(true);
  }
};

export const OpenAllModal = ({
  isModalOpen,
  handleModalToggle,
  hosts,
  jobID,
  onConfirm,
}) => (
  <Modal
    ouiaId="template-invocation-new-tab-modal"
    title={__('Open all failed runs in new tabs')}
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
          hosts.forEach(id => {
            onConfirm(templateInvocationPageUrl(id, jobID));
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
    {__('Are you sure you want to open all failed runs in new tabs?')}
    <br />
    {__('This will open a new tab for each failed run.')}
    <br />
    {__('The number of failed runs is:')} <b>{hosts.length}</b>
  </Modal>
);

OpenAllModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleModalToggle: PropTypes.func.isRequired,
  hosts: PropTypes.array.isRequired,
  jobID: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
