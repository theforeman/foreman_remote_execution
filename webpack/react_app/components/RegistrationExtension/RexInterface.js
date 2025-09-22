import React from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';
import LabelIcon from 'foremanReact/components/common/LabelIcon';

import { FormGroup, TextInput } from '@patternfly/react-core';

const RexInterface = ({ isLoading, onChange }) => (
  <FormGroup
    label={__('Remote Execution Interface')}
    fieldId="reg_rex_interface"
    labelIcon={
      <LabelIcon
        text={__('Identifier of the Host interface for Remote execution')}
      />
    }
  >
    <TextInput
      ouiaId="reg_rex_interface_input"
      type="text"
      onBlur={e => onChange({ remoteExecutionInterface: e.target.value })}
      id="reg_rex_interface_input"
      isDisabled={isLoading}
    />
  </FormGroup>
);

RexInterface.propTypes = {
  onChange: PropTypes.func,
  isLoading: PropTypes.bool,
};

RexInterface.defaultProps = {
  onChange: undefined,
  isLoading: false,
};

export default RexInterface;
