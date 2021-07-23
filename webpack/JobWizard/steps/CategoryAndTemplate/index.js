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
  isFeature,
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
          handleSuccess: response => {
            if (!isFeature) setCategory(response.data.job_categories[0] || '');
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobCategoriesStatus]);

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
          handleSuccess: response => {
            if (!jobTemplate)
              setJobTemplate(
                Number(filterJobTemplates(response?.data?.results)[0]?.id) ||
                  null
              );
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, dispatch]);

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
  isFeature: PropTypes.bool.isRequired,
};
ConnectedCategoryAndTemplate.defaultProps = { jobTemplate: null };

export default ConnectedCategoryAndTemplate;
