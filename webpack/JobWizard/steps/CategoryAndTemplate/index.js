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
  selectOutputTemplateError,
  selectJobTemplatesSearch,
} from '../../JobWizardSelectors';
import { CategoryAndTemplate } from './CategoryAndTemplate';

import {
  JOB_TEMPLATE,
  JOB_TEMPLATES,
  JOB_CATEGORIES,
  templatesUrl,
} from '../../JobWizardConstants';

const ConnectedCategoryAndTemplate = ({
  jobTemplate,
  setJobTemplate,
  category,
  setCategory,
  isCategoryPreselected,
  outputTemplates,
  setOutputTemplates,
  runtimeTemplate,
  setRuntimeTemplate,
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
              if (defaultTemplate) {
                const newJobTemplate = jobTemplate || defaultTemplate;
                setJobTemplate(newJobTemplate);
                if (newJobTemplate)
                  dispatch(
                    get({
                      key: JOB_TEMPLATE,
                      url: `/ui_job_wizard/template/${newJobTemplate}`,
                      handleSuccess: ({ data }) => {
                        if (data)
                          setOutputTemplates(
                            data.default_output_templates || []
                          );
                      },
                    })
                  );
              }
            }
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobCategoriesStatus]);

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
              if (!jobTemplate) {
                const newJobTemplate =
                  jobTemplate ||
                  Number(filterJobTemplates(response?.data?.results)[0]?.id) ||
                  null;
                setJobTemplate(newJobTemplate);
                if (newJobTemplate) {
                  dispatch(
                    get({
                      key: JOB_TEMPLATE,
                      url: `/ui_job_wizard/template/${newJobTemplate}`,
                      handleSuccess: ({ data }) => {
                        setOutputTemplates(data.default_output_templates || []);
                      },
                    })
                  );
                }
              }
            },
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, dispatch]);

  const jobTemplates = useSelector(selectJobTemplates);

  const errors = {
    categoryError: useSelector(selectCategoryError),
    allTemplatesError: useSelector(selectAllTemplatesError),
    templateError: useSelector(selectTemplateError),
    outputTemplateError: useSelector(selectOutputTemplateError),
  };
  return (
    <CategoryAndTemplate
      jobTemplates={jobTemplates}
      jobCategories={jobCategories}
      setJobTemplate={setJobTemplate}
      selectedTemplateID={jobTemplate}
      setCategory={setCategory}
      selectedCategory={category}
      selectedOutputTemplates={outputTemplates}
      setOutputTemplates={setOutputTemplates}
      runtimeTemplate={runtimeTemplate}
      setRuntimeTemplate={setRuntimeTemplate}
      errors={errors}
    />
  );
};

ConnectedCategoryAndTemplate.propTypes = {
  jobTemplate: PropTypes.number,
  setJobTemplate: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  isCategoryPreselected: PropTypes.bool.isRequired,
  outputTemplates: PropTypes.array.isRequired,
  setOutputTemplates: PropTypes.func.isRequired,
  runtimeTemplate: PropTypes.string.isRequired,
  setRuntimeTemplate: PropTypes.func.isRequired,
};
ConnectedCategoryAndTemplate.defaultProps = {
  jobTemplate: null,
};

export default ConnectedCategoryAndTemplate;
