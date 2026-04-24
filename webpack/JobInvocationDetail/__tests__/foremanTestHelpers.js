import React from 'react';
import PropTypes from 'prop-types';
import { getForemanContext } from 'foremanReact/Root/Context/ForemanContext';

export const createForemanContextWrapper = (
  permissions = ['view_job_invocations', 'create_job_invocations']
) => {
  const foremanContextValue = {
    context: {
      metadata: {
        permissions: new Set(permissions),
        UISettings: { perPage: 20 },
      },
    },
    setContext: jest.fn(),
  };
  const ForemanContext = getForemanContext(foremanContextValue);

  const ForemanContextWrapper = ({ children }) => (
    <ForemanContext.Provider value={foremanContextValue}>
      {children}
    </ForemanContext.Provider>
  );

  ForemanContextWrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return ForemanContextWrapper;
};
