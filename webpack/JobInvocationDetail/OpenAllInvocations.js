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
import {
  templateInvocationPageUrl,
  getIdsArray,
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
export const OpenAllInvocations = ({
  allHostsIds,
  bulkParams,
  isAllSelected,
  id,
  setShowAlert,
}) => {
  const idsArray = getIdsArray(bulkParams, allHostsIds, isAllSelected);
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
      isDisabled={idsArray.length === 0}
      isInline
      aria-label="open all template invocations in a new tab"
      ouiaId="template-invocation-new-tab-button"
      className="open-all-button"
      onClick={() => {
        if (idsArray.length <= 3) {
          idsArray.forEach(result => {
            openLink(templateInvocationPageUrl(result, id), '_blank');
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
      title={__('Open all selected invocations in new tabs')}
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
            idsArray.forEach(result => {
              openLink(templateInvocationPageUrl(result.id, id), '_blank');
            });
            handleModalToggle();
          }}
        >
          {__('Open in new tabs')}
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
      {__(
        'Are you sure you want to open all selected invocations in new tabs?'
      )}
      <br />
      {__('This will open a new tab for each invocation. The maximum is 100.')}
      <br />
      {__('The number of selected invocations is:')} <b>{idsArray.length}</b>
    </Modal>
  );
  return (
    <>
      <OpenAllButton />
      <OpenAllModal />
    </>
  );
};

OpenAllInvocations.propTypes = {
  allHostsIds: PropTypes.array.isRequired,
  bulkParams: PropTypes.string,
  id: PropTypes.string.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  setShowAlert: PropTypes.func.isRequired,
};

OpenAllInvocations.defaultProps = {
  bulkParams: undefined,
};

PopupAlert.propTypes = {
  setShowAlert: PropTypes.func.isRequired,
};
