import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { formatter } from '../form/Formatter';

export const TemplateInputs = ({ inputs, value, setValue }) => {
  if (inputs.length)
    return inputs.map(input => formatter(input, value, setValue));
  return (
    <p className="gray-text">
      {__('There are no available input fields for the selected template.')}
    </p>
  );
};
TemplateInputs.propTypes = {
  inputs: PropTypes.array.isRequired,
  value: PropTypes.object,
  setValue: PropTypes.func.isRequired,
};

TemplateInputs.defaultProps = {
  value: {},
};
