import URI from 'urijs';
import { get } from 'lodash';
import {
  selectAPIResponse,
  selectAPIStatus,
  selectAPIErrorMessage,
} from 'foremanReact/redux/API/APISelectors';
import { STATUS } from 'foremanReact/constants';
import { selectRouterLocation } from 'foremanReact/routes/RouterSelector';

import {
  JOB_TEMPLATES,
  JOB_CATEGORIES,
  JOB_TEMPLATE,
  HOSTS_API,
  JOB_INVOCATION,
  JOB_API_KEY,
} from './JobWizardConstants';

export const selectRerunJobInvocationResponse = state =>
  selectAPIResponse(state, JOB_API_KEY) || {};

export const selectRerunJobInvocationStatus = state =>
  selectAPIStatus(state, JOB_API_KEY);

export const selectJobTemplatesStatus = state =>
  selectAPIStatus(state, JOB_TEMPLATES);

export const filterJobTemplates = templates =>
  templates?.filter(template => !template.snippet) || [];

export const selectJobTemplates = state =>
  filterJobTemplates(selectAPIResponse(state, JOB_TEMPLATES)?.results);

export const selectJobTemplatesSearch = state =>
  selectAPIResponse(state, JOB_TEMPLATES)?.search;

export const selectJobCategoriesResponse = state =>
  selectAPIResponse(state, JOB_CATEGORIES) || {};

export const selectJobCategories = state =>
  selectJobCategoriesResponse(state).job_categories || [];

export const selectWithKatello = state =>
  selectJobCategoriesResponse(state).with_katello || false;

export const selectJobCategoriesStatus = state =>
  selectAPIStatus(state, JOB_CATEGORIES);

export const selectCategoryError = state =>
  selectAPIErrorMessage(state, JOB_CATEGORIES);

export const selectJobCategoriesMissingPermissions = state => {
  const jobCategoriesResponse = selectJobCategoriesResponse(state);
  return (
    get(jobCategoriesResponse, [
      'response',
      'data',
      'error',
      'missing_permissions',
    ]) || []
  );
};

export const selectAllTemplatesError = state =>
  selectAPIErrorMessage(state, JOB_TEMPLATES);

export const selectTemplateError = state =>
  selectAPIErrorMessage(state, JOB_TEMPLATE);

export const selectJobTemplate = state =>
  selectAPIResponse(state, JOB_TEMPLATE);

export const selectEffectiveUser = state =>
  selectAPIResponse(state, JOB_TEMPLATE).effective_user;

export const selectAdvancedTemplateInputs = state =>
  selectAPIResponse(state, JOB_TEMPLATE).advanced_template_inputs || [];

export const selectTemplateInputs = state =>
  selectAPIResponse(state, JOB_TEMPLATE).template_inputs || [];

export const selectHostsResponse = state => selectAPIResponse(state, HOSTS_API);

export const selectHostCount = state =>
  selectHostsResponse(state).subtotal || 0;

export const selectHosts = state => {
  const hosts = selectHostsResponse(state).results || [];
  return hosts.map(host => ({
    name: host.name,
    display_name: host.display_name,
  }));
};

export const selectHostsMissingPermissions = state => {
  const hostsResponse = selectHostsResponse(state);
  return (
    get(hostsResponse, ['response', 'data', 'error', 'missing_permissions']) ||
    []
  );
};

export const selectIsLoadingHosts = state =>
  !selectAPIStatus(state, HOSTS_API) ||
  selectAPIStatus(state, HOSTS_API) === STATUS.PENDING;

export const selectResponse = selectAPIResponse;

export const selectIsLoading = (state, key) =>
  selectAPIStatus(state, key) === STATUS.PENDING;

export const selectIsSubmitting = state =>
  selectAPIStatus(state, JOB_INVOCATION) === STATUS.PENDING ||
  selectAPIStatus(state, JOB_INVOCATION) === STATUS.RESOLVED;

export const selectRouterSearch = state => {
  const { search } = selectRouterLocation(state);
  return URI.parseQuery(search);
};
