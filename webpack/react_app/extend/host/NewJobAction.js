import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { DropdownItem, DropdownSeparator } from '@patternfly/react-core';
import { OptimizeIcon } from '@patternfly/react-icons';
import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import { foremanUrl } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';
import { HOST_DETAILS_KEY } from 'foremanReact/components/HostDetails/consts';

const NewJobAction = ({ withIcon, withSeprator }) => {
  const { id } = useSelector(state =>
    selectAPIResponse(state, HOST_DETAILS_KEY)
  );
  const url = id && foremanUrl(`/job_invocations/new?host_ids%5B%5D=${id}`);

  if (url) {
    const actionWithUrl = (
      <DropdownItem icon={withIcon && <OptimizeIcon />} href={url}>
        {__('Run a job')}
      </DropdownItem>
    );
    return withSeprator
      ? [<DropdownSeparator />, actionWithUrl]
      : actionWithUrl;
  }
  return (
    <DropdownItem icon={withIcon && <OptimizeIcon />} isDisabled>
      {__('Run a job')}
    </DropdownItem>
  );
};

NewJobAction.propTypes = {
  withIcon: PropTypes.bool,
  withSeprator: PropTypes.bool,
};

NewJobAction.defaultProps = {
  withIcon: false,
  withSeprator: false,
};

export default NewJobAction;
