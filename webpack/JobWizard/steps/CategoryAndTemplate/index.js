import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import URI from 'urijs';
import { get } from 'foremanReact/redux/API';
import {
  selectJobCategories,
  selectJobTemplates,
  selectJobCategoriesStatus,
  filterJobTemplates,
  selectCategoryError,
  selectAllTemplatesError,
  selectTemplateError,
} from '../../JobWizardSelectors';
import { CategoryAndTemplate } from './CategoryAndTemplate';

import {
  JOB_TEMPLATES,
  JOB_CATEGORIES,
  templatesUrl,
} from '../../JobWizardConstants';

const ConnectedCategoryAndTemplate = ({
  jobTemplate,
  setJobTemplate,
  category,
  setCategory,
}) => {
  const dispatch = useDispatch();

  const jobCategoriesStatus = useSelector(selectJobCategoriesStatus);
  useEffect(() => {
    if (!jobCategoriesStatus) {
      // Don't reload categories if they are already loaded
      dispatch(
        get({
          key: JOB_CATEGORIES,
          url: '/ui_job_wizard/categories',
          handleSuccess: response =>
            setCategory(response.data.job_categories[0] || ''),
        })
      );
    }
  }, [jobCategoriesStatus, dispatch, setCategory]);

  const jobCategories = useSelector(selectJobCategories);
  useEffect(() => {
    if (category) {
      const templatesUrlObject = new URI(templatesUrl);
      dispatch(
        get({
          key: JOB_TEMPLATES,
          url: templatesUrlObject.addSearch({
            search: `job_category="${category}"`,
            per_page: 'all',
          }),
          handleSuccess: response =>
            setJobTemplate(
              Number(filterJobTemplates(response?.data?.results)[0]?.id) || null
            ),
        })
      );
    }
  }, [category, dispatch, setJobTemplate]);

  const jobTemplates = useSelector(selectJobTemplates);

  const errors = {
    categoryError: useSelector(selectCategoryError),
    allTemplatesError: useSelector(selectAllTemplatesError),
    templateError: useSelector(selectTemplateError),
  };
  return (
    <CategoryAndTemplate
      jobTemplates={jobTemplates}
      jobCategories={jobCategories}
      setJobTemplate={setJobTemplate}
      selectedTemplateID={jobTemplate}
      setCategory={setCategory}
      selectedCategory={category}
      errors={errors}
    />
  );
};

ConnectedCategoryAndTemplate.propTypes = {
  jobTemplate: PropTypes.number,
  setJobTemplate: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
};
ConnectedCategoryAndTemplate.defaultProps = { jobTemplate: null };

export default ConnectedCategoryAndTemplate;
