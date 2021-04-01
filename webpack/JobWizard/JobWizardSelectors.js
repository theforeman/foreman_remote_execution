import {
  selectAPIResponse,
  selectAPIStatus,
} from 'foremanReact/redux/API/APISelectors';

import { JOB_TEMPLATES, JOB_CATEGORIES } from './JobWizardConstants';

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
