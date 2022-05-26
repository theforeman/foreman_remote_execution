import React from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';
import LabelIcon from 'foremanReact/components/common/LabelIcon';

import {
  FormGroup,
  FormSelectOption,
  FormSelect,
} from '@patternfly/react-core';

import { HelpIcon } from '@patternfly/react-icons';

const options = (value = '') => {
  const defaultValue = value ? __('yes') : __('no');
  const defaultLabel = `${__('Inherit from host parameter')} (${defaultValue})`;

  return (
    <>
      <FormSelectOption key={0} value="" label={defaultLabel} />
      <FormSelectOption key={1} value label={__('Yes (override)')} />
      <FormSelectOption key={2} value={false} label={__('No (override)')} />
    </>
  );
};

const RexPull = ({ isLoading, onChange, pluginValues, configParams }) => (
  <FormGroup
    label={__('Setup REX pull mode')}
    isRequired
    labelIcon={
      <LabelIcon
        text={__(
          'Setup remote execution pull mode. If set to `Yes`. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.'
        )}
      />
    }
    fieldId="registration_setup_remote_execution_pull"
  >
    <FormSelect
      value={pluginValues.setupRemoteExecutionPull}
      onChange={setupRemoteExecutionPull =>
        onChange({ setupRemoteExecutionPull })
      }
      className="without_select2"
      id="registration_setup_remote_execution_pull"
      isDisabled={isLoading}
      isRequired
    >
      {/* eslint-disable-next-line camelcase */
      options(configParams?.host_registration_remote_execution_pull)}
    </FormSelect>
  </FormGroup>
);

RexPull.propTypes = {
  onChange: PropTypes.func,
  isLoading: PropTypes.bool,
  pluginValues: PropTypes.shape({
    setupRemoteExecutionPull: PropTypes.bool,
  }),
};

RexPull.defaultProps = {
  onChange: undefined,
  isLoading: false,
  pluginValues: {},
};

export default RexPull;
