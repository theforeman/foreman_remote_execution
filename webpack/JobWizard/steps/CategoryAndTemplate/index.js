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
  selectJobTemplatesSearch,
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
  setFeature,
  isCategoryPreselected,
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
          handleSuccess: ({
            data: {
              default_category: defaultCategory,
              job_categories: jobCategories,
              default_template: defaultTemplate,
            },
          }) => {
            if (!isCategoryPreselected) {
              setCategory(defaultCategory || jobCategories[0] || '');
              if (defaultTemplate)
                setJobTemplate(current => current || defaultTemplate);
            }
          },
        })
      );
    }
  }, [
    jobCategoriesStatus,
    dispatch,
    isCategoryPreselected,
    setCategory,
    setJobTemplate,
  ]);

  const jobCategories = useSelector(selectJobCategories);
  const jobTemplatesSearch = useSelector(selectJobTemplatesSearch);
  useEffect(() => {
    if (category) {
      const newJobTemplatesSearch = `job_category="${category}"`;
      if (jobTemplatesSearch !== newJobTemplatesSearch) {
        const templatesUrlObject = new URI(templatesUrl);
        dispatch(
          get({
            key: JOB_TEMPLATES,
            url: templatesUrlObject.addSearch({
              search: newJobTemplatesSearch,
              per_page: 'all',
            }),
            handleSuccess: response => {
              const filteredTemplates = filterJobTemplates(
                response?.data?.results
              );
              setJobTemplate(current => {
                // Check if current template is in the new category's template list.
                // This preserves the user's selection when changing categories on rerun,
                // preventing the category from flashing and reverting back (Issue #38899).
                // We check the state value (current) rather than the prop to avoid race conditions.
                if (
                  current &&
                  filteredTemplates.some(template => template.id === current)
                ) {
                  return current;
                }
                // Otherwise, select the first template from the new category
                return Number(filteredTemplates[0]?.id) || null;
              });
            },
          })
        );
      }
    }
  }, [category, dispatch, jobTemplatesSearch, setJobTemplate]);

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
      setFeature={setFeature}
      errors={errors}
    />
  );
};

ConnectedCategoryAndTemplate.propTypes = {
  jobTemplate: PropTypes.number,
  setJobTemplate: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  setFeature: PropTypes.func.isRequired,
  isCategoryPreselected: PropTypes.bool.isRequired,
};
ConnectedCategoryAndTemplate.defaultProps = { jobTemplate: null };

export default ConnectedCategoryAndTemplate;
