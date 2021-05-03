import React from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';

import { FormGroup, TextInput, Popover } from '@patternfly/react-core';

import { HelpIcon } from '@patternfly/react-icons';

const RexInterface = ({ isLoading, onChange }) => (
  <FormGroup
    label={__('Remote Execution Interface')}
    fieldId="reg_rex_interface"
    labelIcon={
      <Popover
        bodyContent={
          <div>
            {__('Identifier of the Host interface for Remote execution')}
          </div>
        }
      >
        <button
          className="pf-c-form__group-label-help"
          onClick={e => e.preventDefault()}
        >
          <HelpIcon noVerticalAlign />
        </button>
      </Popover>
    }
  >
    <TextInput
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
