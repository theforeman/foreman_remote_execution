/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';
import LabelIcon from 'foremanReact/components/common/LabelIcon';
import { Alert } from 'patternfly-react';

import {
  FormGroup,
  FormSelectOption,
  FormSelect,
} from '@patternfly/react-core';

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

const pullWarning = (
  <Alert type="info" isInline style={{ marginTop: '10px' }}>
    {__(
      'Please make sure that the Smart Proxy is configured correctly for the Pull provider.'
    )}
  </Alert>
);

function showPullWarning(valueFromParam, value) {
  if (value === 'true') {
    return pullWarning;
  }
  if (valueFromParam && (value === undefined || value === '')) {
    return pullWarning;
  }

  return null;
}

const RexPull = ({ isLoading, onChange, pluginValues, configParams }) => (
  <FormGroup
    label={__('REX pull mode')}
    labelIcon={
      <LabelIcon
        text={__(
          'Setup remote execution pull mode. If set to `Yes`, pull provider client will be deployed on the registered host. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.'
        )}
      />
    }
    fieldId="registration_setup_remote_execution_pull"
  >
    <FormSelect
      ouiaId="registration_setup_remote_execution_pull"
      value={pluginValues.setupRemoteExecutionPull}
      onChange={(_event, setupRemoteExecutionPull) =>
        onChange({ setupRemoteExecutionPull })
      }
      className="without_select2"
      id="registration_setup_remote_execution_pull"
      isDisabled={isLoading}
    >
      {options(configParams?.host_registration_remote_execution_pull)}
    </FormSelect>

    {showPullWarning(
      configParams?.host_registration_remote_execution_pull,
      pluginValues.setupRemoteExecutionPull
    )}
  </FormGroup>
);

RexPull.propTypes = {
  onChange: PropTypes.func,
  isLoading: PropTypes.bool,
  pluginValues: PropTypes.shape({
    setupRemoteExecutionPull: PropTypes.bool,
  }),
  configParams: PropTypes.shape({
    host_registration_remote_execution_pull: PropTypes.bool,
  }),
};

RexPull.defaultProps = {
  onChange: undefined,
  isLoading: false,
  pluginValues: {},
  configParams: {},
};

export default RexPull;
