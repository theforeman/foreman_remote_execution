import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import URI from 'urijs';
import { List, ListItem, Modal, Button } from '@patternfly/react-core';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { selectHosts, selectHostCount } from '../../JobWizardSelectors';
import { HOSTS_TO_PREVIEW_AMOUNT } from '../../JobWizardConstants';

export const HostPreviewModal = ({ isOpen, setIsOpen, searchQuery }) => {
  const hosts = useSelector(selectHosts);
  const hostsCount = useSelector(selectHostCount);
  const url = new URI(foremanUrl('/hosts'));

  return (
    <Modal
      title={__('Preview Hosts')}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      appendTo={() => document.getElementsByClassName('job-wizard')[0]}
    >
      <List isPlain>
        {hosts.map(host => (
          <ListItem key={host}>
            <Button
              component="a"
              href={foremanUrl(`/hosts/${host}`)}
              variant="link"
              target="_blank"
              rel="noreferrer"
            >
              {host}
            </Button>
          </ListItem>
        ))}
        {hostsCount > HOSTS_TO_PREVIEW_AMOUNT && (
          <ListItem>
            <Button
              component="a"
              href={url.addSearch({ search: searchQuery })}
              variant="link"
              target="_blank"
              rel="noreferrer"
            >
              {sprintf(
                __('...and %s more'),
                hostsCount - HOSTS_TO_PREVIEW_AMOUNT
              )}
            </Button>
          </ListItem>
        )}
      </List>
    </Modal>
  );
};

HostPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
};
HostPreviewModal.defaultPropTypes = {
  searchQuery: '',
};
