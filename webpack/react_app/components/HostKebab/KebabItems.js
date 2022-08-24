import React from 'react';
import { useSelector } from 'react-redux';
import { DropdownItem } from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import { translate as __ } from 'foremanReact/common/I18n';
import { HOST_DETAILS_KEY } from 'foremanReact/components/HostDetails/consts';

const HostKebabItems = () => {
  const { cockpit_url: consoleUrl } = useSelector(state =>
    selectAPIResponse(state, HOST_DETAILS_KEY)
  );

  if (!consoleUrl) return null;
  return (
    <DropdownItem
      ouiaId="web-console-dropdown-item"
      icon={<CodeIcon />}
      href={consoleUrl}
      target="_blank"
      rel="noreferrer"
    >
      {__('Web Console')}
    </DropdownItem>
  );
};

export default HostKebabItems;
