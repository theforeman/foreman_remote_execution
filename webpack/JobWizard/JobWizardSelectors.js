import URI from 'urijs';
import {
  selectAPIResponse,
  selectAPIStatus,
  selectAPIErrorMessage,
} from 'foremanReact/redux/API/APISelectors';
import { STATUS } from 'foremanReact/constants';
import { selectRouterLocation } from 'foremanReact/routes/RouterSelector';

import {
  JOB_TEMPLATES,
  OUTPUT_TEMPLATES,
  JOB_CATEGORIES,
  JOB_TEMPLATE,
  OUTPUT_TEMPLATE,
  HOSTS_API,
  JOB_INVOCATION,
} from './JobWizardConstants';

export const selectJobTemplatesStatus = state =>
  selectAPIStatus(state, JOB_TEMPLATES);

export const filterJobTemplates = templates =>
  templates?.filter(template => !template.snippet) || [];

export const selectJobTemplates = state =>
  filterJobTemplates(selectAPIResponse(state, JOB_TEMPLATES)?.results);

export const selectJobTemplatesSearch = state =>
  selectAPIResponse(state, JOB_TEMPLATES)?.search;

export const filterOutputTemplates = templates =>
  templates?.filter(template => !template.snippet) || [];

export const selectOutputTemplates = state =>
  filterOutputTemplates(selectAPIResponse(state, OUTPUT_TEMPLATES)?.results) ||
  filterOutputTemplates(selectAPIResponse(state, OUTPUT_TEMPLATES));

export const selectOutputTemplatesStatus = state =>
  selectAPIStatus(state, OUTPUT_TEMPLATES);

export const selectOutputTemplatesSearch = state =>
  selectAPIResponse(state, OUTPUT_TEMPLATES)?.search;

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

export const selectAllTemplatesError = state =>
  selectAPIErrorMessage(state, JOB_TEMPLATES);

export const selectTemplateError = state =>
  selectAPIErrorMessage(state, JOB_TEMPLATE);

export const selectOutputTemplateError = state =>
  selectAPIErrorMessage(state, OUTPUT_TEMPLATE);

export const selectJobTemplate = state =>
  selectAPIResponse(state, JOB_TEMPLATE);

export const selectEffectiveUser = state =>
  selectAPIResponse(state, JOB_TEMPLATE).effective_user;

export const selectAdvancedTemplateInputs = state =>
  selectAPIResponse(state, JOB_TEMPLATE).advanced_template_inputs || [];

export const selectDefaultOutputTemplates = state =>
  selectAPIResponse(state, JOB_TEMPLATE).default_output_templates || [];

export const selectTemplateInputs = state =>
  selectAPIResponse(state, JOB_TEMPLATE).template_inputs || [];

export const selectHostCount = state =>
  selectAPIResponse(state, HOSTS_API).subtotal || 0;

export const selectHosts = state =>
  (selectAPIResponse(state, HOSTS_API).results || []).map(host => host.name);

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
