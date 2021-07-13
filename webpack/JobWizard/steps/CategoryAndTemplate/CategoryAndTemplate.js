import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextVariants, Form, Alert } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { SelectField } from '../form/SelectField';
import { GroupedSelectField } from '../form/GroupedSelectField';
import { WizardTitle } from '../form/WizardTitle';
import { WIZARD_TITLES } from '../../JobWizardConstants';

export const CategoryAndTemplate = ({
  jobCategories,
  jobTemplates,
  setJobTemplate,
  selectedTemplateID,
  selectedCategory,
  setCategory,
  errors,
}) => {
  const templatesGroups = {};
  jobTemplates.forEach(template => {
    if (templatesGroups[template.provider_type]?.options)
      templatesGroups[template.provider_type].options.push({
        label: template.name,
        value: template.id,
      });
    else
      templatesGroups[template.provider_type] = {
        options: [{ label: template.name, value: template.id }],
        groupLabel: template.provider_type,
      };
  });

  const selectedTemplate = jobTemplates.find(
    template => template.id === selectedTemplateID
  )?.name;

  const onSelectCategory = newCategory => {
    setCategory(newCategory);
    setJobTemplate(null);
  };
  const { categoryError, allTemplatesError, templateError } = errors;
  const isError = !!(categoryError || allTemplatesError || templateError);
  return (
    <>
      <WizardTitle title={WIZARD_TITLES.categoryAndTemplate} />
      <Text component={TextVariants.p}>{__('All fields are required.')}</Text>
      <Form>
        <SelectField
          label={__('Job category')}
          fieldId="job_category"
          options={jobCategories}
          setValue={onSelectCategory}
          value={selectedCategory}
          placeholderText={categoryError ? __('Error') : ''}
          isDisabled={!!categoryError}
        />
        <GroupedSelectField
          label={__('Job template')}
          fieldId="job_template"
          groups={Object.values(templatesGroups)}
          setSelected={setJobTemplate}
          selected={selectedTemplate}
          isDisabled={!!(categoryError || allTemplatesError)}
          placeholderText={allTemplatesError ? __('Error') : ''}
        />
        {isError && (
          <Alert variant="danger" title={__('Errors:')}>
            {categoryError && (
              <span>
                {__('Categories list failed with:')} {categoryError}
              </span>
            )}
            {allTemplatesError && (
              <span>
                {__('Templates list failed with:')} {allTemplatesError}
              </span>
            )}
            {templateError && (
              <span>
                {__('Template failed with:')} {templateError}
              </span>
            )}
          </Alert>
        )}
      </Form>
    </>
  );
};

CategoryAndTemplate.propTypes = {
  jobCategories: PropTypes.array,
  jobTemplates: PropTypes.array,
  setJobTemplate: PropTypes.func.isRequired,
  selectedTemplateID: PropTypes.number,
  setCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  errors: PropTypes.shape({
    categoryError: PropTypes.string,
    allTemplatesError: PropTypes.string,
    templateError: PropTypes.string,
  }),
};
CategoryAndTemplate.defaultProps = {
  jobCategories: [],
  jobTemplates: [],
  selectedTemplateID: null,
  selectedCategory: null,
  errors: {},
};

export default CategoryAndTemplate;
