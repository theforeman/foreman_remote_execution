import React from 'react';
import PropTypes from 'prop-types';
import { Title, Text, TextVariants, Form } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { SelectField } from '../form/SelectField';
import { GroupedSelectField } from '../form/GroupedSelectField';

export const CategoryAndTemplate = ({
  jobCategories,
  jobTemplates,
  setJobTemplate,
  selectedTemplateID,
  selectedCategory,
  setCategory,
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
  return (
    <>
      <Title headingLevel="h2">{__('Category And Template')}</Title>
      <Text component={TextVariants.p}>{__('All fields are required.')}</Text>
      <Form>
        <SelectField
          label={__('Job category')}
          fieldId="job_category"
          options={jobCategories}
          setValue={onSelectCategory}
          value={selectedCategory}
        />
        <GroupedSelectField
          label={__('Job template')}
          fieldId="job_template"
          groups={Object.values(templatesGroups)}
          setSelected={setJobTemplate}
          selected={selectedTemplate}
        />
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
};
CategoryAndTemplate.defaultProps = {
  jobCategories: [],
  jobTemplates: [],
  selectedTemplateID: null,
  selectedCategory: null,
};

export default CategoryAndTemplate;
