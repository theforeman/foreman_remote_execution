import {
  selectAPIResponse,
  selectAPIStatus,
  selectAPIErrorMessage,
} from 'foremanReact/redux/API/APISelectors';

import {
  JOB_TEMPLATES,
  JOB_CATEGORIES,
  JOB_TEMPLATE,
} from './JobWizardConstants';

export const selectJobTemplatesStatus = state =>
  selectAPIStatus(state, JOB_TEMPLATES);

export const filterJobTemplates = templates =>
  templates?.filter(template => !template.snippet) || [];

export const selectJobTemplates = state =>
  filterJobTemplates(selectAPIResponse(state, JOB_TEMPLATES)?.results);

export const selectJobCategories = state =>
  selectAPIResponse(state, JOB_CATEGORIES).job_categories || [];

export const selectJobCategoriesStatus = state =>
  selectAPIStatus(state, JOB_CATEGORIES);

export const selectCategoryError = state =>
  selectAPIErrorMessage(state, JOB_CATEGORIES);

export const selectAllTemplatesError = state =>
  selectAPIErrorMessage(state, JOB_TEMPLATES);

export const selectTemplateError = state =>
  selectAPIErrorMessage(state, JOB_TEMPLATE);

export const selectJobTemplate = state =>
  selectAPIResponse(state, JOB_TEMPLATE);
