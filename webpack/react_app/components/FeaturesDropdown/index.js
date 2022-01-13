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
  const {
    response: { results: features },
    status,
  } = useAPI('get', foremanUrl(REX_FEATURES_API));
  const dispatch = useDispatch();
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
      alignments={{ default: 'right' }}
      onSelect={() => setIsOpen(false)}
      toggle={
        <DropdownToggle
          splitButtonItems={scheduleJob}
          toggleVariant="primary"
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
  hostId: PropTypes.string,
};
FeaturesDropdown.defaultProps = {
  hostId: undefined,
};

export default FeaturesDropdown;
