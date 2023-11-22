import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DropdownItem,
  Dropdown,
  DropdownToggle,
  DropdownToggleAction,
} from '@patternfly/react-core';
import { push } from 'connected-react-router';

import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl, propsToCamelCase } from 'foremanReact/common/helpers';
import { STATUS } from 'foremanReact/constants';

import {
  REX_FEATURES_HOST_URL,
  ALL_REX_FEATURES_URL,
  NEW_JOB_PAGE,
  ALL_HOSTS_NEW_JOB_PAGE,
} from './constants';
import { runFeature } from './actions';
import './index.scss';

const FeaturesDropdown = ({
  hostId,
  hostSearch,
  hostResponse,
  selectedCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSingleHost = !!hostId; // identifies whether we're on the host details or host overview page
  const rexFeaturesUrl = isSingleHost
    ? REX_FEATURES_HOST_URL(hostId)
    : ALL_REX_FEATURES_URL;
  const { response, status } = useAPI('get', foremanUrl(rexFeaturesUrl));
  const dispatch = useDispatch();
  const permissions = propsToCamelCase(
    (isSingleHost ? response?.permissions : hostResponse?.response) || {}
  );
  const canRunJob = isSingleHost
    ? permissions.canRunJob
    : permissions.canCreateJobInvocations;
  if (!canRunJob) {
    return null;
  }

  const features = isSingleHost
    ? response?.remote_execution_features // eslint-disable-line camelcase
    : response?.results;
  const dropdownItems = features
    ?.filter(feature => feature.host_action_button)
    ?.map(({ name, label, id, description }) => (
      <DropdownItem
        onClick={() => dispatch(runFeature(hostId, label, name, hostSearch))}
        key={id}
        description={description}
      >
        {name}
      </DropdownItem>
    ));
  const newJobPageUrl = hostId
    ? `${NEW_JOB_PAGE}=${hostId}`
    : `${ALL_HOSTS_NEW_JOB_PAGE}=${hostSearch}`;
  const scheduleJob = [
    <DropdownToggleAction
      onClick={() => dispatch(push(newJobPageUrl))}
      key="schedule-job-action"
    >
      {__('Schedule a job')}
    </DropdownToggleAction>,
  ];

  const disableDropdown = !isSingleHost && selectedCount === 0;

  return (
    <Dropdown
      ouiaId="schedule-a-job-dropdown"
      id="schedule-a-job-dropdown"
      alignments={{ default: 'right' }}
      onSelect={() => setIsOpen(false)}
      toggle={
        <DropdownToggle
          ouiaId="schedule-a-job-dropdown-toggle"
          id="schedule-a-job-dropdown-toggle"
          splitButtonItems={scheduleJob}
          toggleVariant="secondary"
          onToggle={() => setIsOpen(prev => !prev)}
          isDisabled={status === STATUS.PENDING || disableDropdown}
          splitButtonVariant="action"
        />
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};

FeaturesDropdown.propTypes = {
  hostId: PropTypes.number,
  hostSearch: PropTypes.string,
  selectedCount: PropTypes.number,
  hostResponse: PropTypes.shape({
    response: PropTypes.shape({
      results: PropTypes.arrayOf(
        PropTypes.shape({
          can_create_job_invocations: PropTypes.bool,
        })
      ),
    }),
  }),
};
FeaturesDropdown.defaultProps = {
  hostId: undefined,
  hostSearch: undefined,
  selectedCount: 0,
  hostResponse: undefined,
};

export default FeaturesDropdown;
