import React from 'react';
import PropTypes from 'prop-types';

const Head = ({ children }) => <div>{children}</div>;

Head.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Head;
