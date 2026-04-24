import React from 'react';

const getForemanContext = contextData => {
  window.tfm_forced_singletons = window.tfm_forced_singletons || {};

  if (!window.tfm_forced_singletons.Context) {
    window.tfm_forced_singletons.Context = React.createContext(contextData);
  }

  return window.tfm_forced_singletons.Context;
};

export { getForemanContext };
export const useForemanOrganization = () => ({ id: 1 });
export const useForemanLocation = () => ({ id: 2 });
export const useForemanVersion = () => '3.7';
export const useForemanHostsPageUrl = () => '/hosts';
export const useForemanHostDetailsPageUrl = () => '/hosts/';
export const useForemanSettings = () => ({ perPage: 20 });
export const useForemanPermissions = () =>
  new Set(['view_job_invocations', 'create_job_invocations']);
