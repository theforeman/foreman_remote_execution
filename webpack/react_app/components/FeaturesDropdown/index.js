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
import { foremanUrl } from 'foremanReact/common/helpers';
import { STATUS } from 'foremanReact/constants';

import { REX_FEATURES_API, NEW_JOB_PAGE } from './constant';
import { runFeature } from './actions';

const FeaturesDropdown = ({ hostId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { response, status } = useAPI(
    'get',
    foremanUrl(REX_FEATURES_API(hostId))
  );
  const dispatch = useDispatch();
  // eslint-disable-next-line camelcase
  const canRunJob = response?.permissions?.can_run_job;
  if (!canRunJob) {
    return null;
  }
  // eslint-disable-next-line camelcase
  const features = response?.remote_execution_features;
  const dropdownItems = features
    ?.filter(feature => feature.host_action_button)
    ?.map(({ name, label, id, description }) => (
      <DropdownItem
        onClick={() => dispatch(runFeature(hostId, label, name))}
        key={id}
        description={description}
      >
        {name}
      </DropdownItem>
    ));
  const scheduleJob = [
    <DropdownToggleAction
      onClick={() => dispatch(push(`${NEW_JOB_PAGE}=${hostId}`))}
      key="schedule-job-action"
    >
      {__('Schedule a job')}
    </DropdownToggleAction>,
  ];

  return (
    <Dropdown
      ouiaId="schedule-a-job-dropdown"
      alignments={{ default: 'right' }}
      onSelect={() => setIsOpen(false)}
      toggle={
        <DropdownToggle
          ouiaId="schedule-a-job-dropdown-toggle"
          splitButtonItems={scheduleJob}
          toggleVariant="secondary"
          onToggle={() => setIsOpen(prev => !prev)}
          isDisabled={status === STATUS.PENDING}
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
};
FeaturesDropdown.defaultProps = {
  hostId: undefined,
};

export default FeaturesDropdown;
