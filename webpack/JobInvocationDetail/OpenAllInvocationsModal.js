import {
  Alert,
  AlertActionCloseButton,
  Button,
  Modal,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';
import React from 'react';
import {
  getIdsArray,
  templateInvocationPageUrl,
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
  allHostsIds,
  bulkParams,
  failedCount,
  fetchFailedHosts,
  isAllSelected,
  isOpen,
  isOpenFailed,
  jobID,
  onClose,
  setShowAlert,
}) => {
  const idsArray = getIdsArray(bulkParams, allHostsIds, isAllSelected);
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
      title={__(`Open all ${modalText} invocations in new tabs`)}
      titleIconVariant="warning"
      width={590}
      actions={[
        <Button
          ouiaId="template-invocation-new-tab-modal-confirm"
          key="confirm"
          variant="primary"
          onClick={async () => {
            let hostsToOpen = [];

            if (isOpenFailed) {
              const fetchedHosts = await fetchFailedHosts();
              hostsToOpen = fetchedHosts;
            } else {
              hostsToOpen = idsArray.map(id => ({ id }));
            }

            hostsToOpen
              .slice(0, 100)
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
      {__(
        `Are you sure you want to open all ${modalText} invocations in new tabs?`
      )}
      <br />
      {__('This will open a new tab for each invocation. The maximum is 100.')}
      <br />
      {__(`The number of ${modalText} invocations is:`)}{' '}
      <b>{isOpenFailed ? failedCount : idsArray.length}</b>
    </Modal>
  );
};

OpenAllInvocationsModal.propTypes = {
  allHostsIds: PropTypes.array.isRequired,
  bulkParams: PropTypes.string,
  failedCount: PropTypes.number.isRequired,
  fetchFailedHosts: PropTypes.func,
  isAllSelected: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenFailed: PropTypes.bool,
  jobID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired,
};

OpenAllInvocationsModal.defaultProps = {
  bulkParams: '',
  fetchFailedHosts: undefined,
  isOpenFailed: false,
};

PopupAlert.propTypes = {
  setShowAlert: PropTypes.func.isRequired,
};

export default OpenAllInvocationsModal;
