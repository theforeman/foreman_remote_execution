import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';

export const WizardTitle = ({ title, ...props }) => (
  <Title
    ouiaId="wizard-title"
    headingLevel="h2"
    className="wizard-title"
    {...props}
  >
    {title}
  </Title>
);

WizardTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
export default WizardTitle;
