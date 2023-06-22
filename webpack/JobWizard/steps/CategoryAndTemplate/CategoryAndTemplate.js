import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  TextVariants,
  Form,
  Alert,
  FormGroup,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { get } from 'foremanReact/redux/API';
import { SelectField } from '../form/SelectField';
import { GroupedSelectField } from '../form/GroupedSelectField';
import { WizardTitle } from '../form/WizardTitle';
import {
  WIZARD_TITLES,
  JOB_TEMPLATES,
  JOB_TEMPLATE,
  OUTPUT_TEMPLATES,
  outputTemplatesUrl,
} from '../../JobWizardConstants';
import { selectIsLoading } from '../../JobWizardSelectors';
import { OutputSelect } from './searchOutputTemplates';
import { SelectedTemplates } from './SelectedTemplates';
import { OutputTemplateTextField } from './OutputTemplateTextField';

export const CategoryAndTemplate = ({
  jobCategories,
  jobTemplates,
  selectedOutputTemplates,
  runtimeTemplate,
  setJobTemplate,
  setOutputTemplates,
  setRuntimeTemplate,
  selectedTemplateID,
  selectedCategory,
  setCategory,
  errors,
}) => {
  const dispatch = useDispatch();
  const templatesGroups = {};
  const isTemplatesLoading = useSelector(state =>
    selectIsLoading(state, JOB_TEMPLATES)
  );
  if (!isTemplatesLoading) {
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
  }

  const selectedTemplate = jobTemplates.find(
    template => template.id === selectedTemplateID
  )?.name;

  const onSelectCategory = newCategory => {
    if (selectedCategory !== newCategory) {
      setCategory(newCategory);
      onSelectJobTemplate(null);
    }
  };

  const onSelectJobTemplate = newJobTemplateID => {
    if (selectedTemplateID !== newJobTemplateID) {
      setJobTemplate(newJobTemplateID);
      if (newJobTemplateID) {
        dispatch(
          get({
            key: JOB_TEMPLATE,
            url: `/ui_job_wizard/template/${newJobTemplateID}`,
            handleSuccess: ({ data }) => {
              if (data) setOutputTemplates(data.default_output_templates || []);
            },
          })
        );
      }
    }
  };

  const {
    categoryError,
    allTemplatesError,
    templateError,
    outputTemplateError,
  } = errors;
  const isError = !!(
    categoryError ||
    allTemplatesError ||
    templateError ||
    outputTemplateError
  );

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
          isRequired
        />
        <GroupedSelectField
          label={__('Job template')}
          fieldId="job_template"
          groups={Object.values(templatesGroups)}
          setSelected={onSelectJobTemplate}
          selected={isTemplatesLoading ? [] : selectedTemplate}
          isDisabled={
            !!(categoryError || allTemplatesError || isTemplatesLoading)
          }
          placeholderText={allTemplatesError ? __('Error') : ''}
        />
        <FormGroup label={__('Output templates')} fieldId="output_template">
          <OutputSelect
            selected={selectedOutputTemplates}
            setSelected={setOutputTemplates}
            apiKey={OUTPUT_TEMPLATES}
            name="output_templates"
            url={outputTemplatesUrl}
            placeholderText={__('Output templates')}
          />
        </FormGroup>

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
            {outputTemplateError && (
              <span>
                {__('Output template failed with:')} {outputTemplateError}
              </span>
            )}
          </Alert>
        )}
        <OutputTemplateTextField
          runtimeTemplate={runtimeTemplate}
          setRuntimeTemplate={setRuntimeTemplate}
        />
        <SelectedTemplates
          selectedOutputTemplates={selectedOutputTemplates}
          setOutputTemplates={setOutputTemplates}
          runtimeTemplate={runtimeTemplate}
          setRuntimeTemplate={setRuntimeTemplate}
        />
      </Form>
    </>
  );
};

CategoryAndTemplate.propTypes = {
  jobCategories: PropTypes.array,
  jobTemplates: PropTypes.array,
  selectedOutputTemplates: PropTypes.array.isRequired,
  runtimeTemplate: PropTypes.string.isRequired,
  setJobTemplate: PropTypes.func.isRequired,
  setOutputTemplates: PropTypes.func.isRequired,
  setRuntimeTemplate: PropTypes.func.isRequired,
  selectedTemplateID: PropTypes.number,
  setCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  errors: PropTypes.shape({
    categoryError: PropTypes.string,
    allTemplatesError: PropTypes.string,
    templateError: PropTypes.string,
    outputTemplateError: PropTypes.string,
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
