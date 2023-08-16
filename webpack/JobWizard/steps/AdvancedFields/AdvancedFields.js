/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Form } from '@patternfly/react-core';
import {
  selectEffectiveUser,
  selectAdvancedTemplateInputs,
  selectJobTemplate,
} from '../../JobWizardSelectors';
import { generateDefaultDescription } from '../../JobWizardHelpers';
import {
  EffectiveUserField,
  TimeoutToKillField,
  TimeToPickupField,
  PasswordField,
  KeyPassphraseField,
  EffectiveUserPasswordField,
  ConcurrencyLevelField,
  TemplateInputsFields,
  ExecutionOrderingField,
  SSHUserField,
} from './Fields';
import { DescriptionField } from './DescriptionField';
import { WIZARD_TITLES } from '../../JobWizardConstants';
import { WizardTitle } from '../form/WizardTitle';

export const AdvancedFields = ({
  templateValues,
  advancedValues,
  setAdvancedValues,
}) => {
  const effectiveUser = useSelector(selectEffectiveUser);
  const advancedTemplateInputs = useSelector(selectAdvancedTemplateInputs);
  const jobTemplate = useSelector(selectJobTemplate);
  return (
    <>
      <WizardTitle
        title={WIZARD_TITLES.advanced}
        className="advanced-fields-title"
      />
      <Form id="advanced-fields-job-template" autoComplete="off">
        <TemplateInputsFields
          inputs={advancedTemplateInputs}
          value={advancedValues.templateValues}
          setValue={newValue => setAdvancedValues({ templateValues: newValue })}
          defaultValue={jobTemplate}
        />
        <SSHUserField
          value={advancedValues.sshUser}
          defaultValue={jobTemplate.ssh_user}
          setValue={newValue =>
            setAdvancedValues({
              sshUser: newValue,
            })
          }
        />
        {effectiveUser?.overridable && (
          <EffectiveUserField
            value={advancedValues.effectiveUserValue}
            defaultValue={jobTemplate.effective_user?.value}
            setValue={newValue =>
              setAdvancedValues({
                effectiveUserValue: newValue,
              })
            }
          />
        )}
        <DescriptionField
          inputValues={{ ...templateValues, ...advancedValues.templateValues }}
          value={advancedValues.description}
          setValue={newValue => setAdvancedValues({ description: newValue })}
          defaultValue={generateDefaultDescription({
            description_format: jobTemplate.job_template.description_format,
            advancedInputs: jobTemplate.advanced_template_inputs,
            inputs: jobTemplate.template_inputs,
            name: jobTemplate.job_template.name,
          })}
        />
        <TimeoutToKillField
          value={advancedValues.timeoutToKill}
          defaultValue={jobTemplate.job_template.execution_timeout_interval}
          setValue={newValue =>
            setAdvancedValues({
              timeoutToKill: newValue,
            })
          }
        />
        <TimeToPickupField
          value={advancedValues.timeToPickup}
          setValue={newValue =>
            setAdvancedValues({
              timeToPickup: newValue,
            })
          }
        />
        <PasswordField
          value={advancedValues.password}
          setValue={newValue =>
            setAdvancedValues({
              password: newValue,
            })
          }
        />
        <KeyPassphraseField
          value={advancedValues.keyPassphrase}
          setValue={newValue =>
            setAdvancedValues({
              keyPassphrase: newValue,
            })
          }
        />
        <EffectiveUserPasswordField
          value={advancedValues.effectiveUserPassword}
          setValue={newValue =>
            setAdvancedValues({
              effectiveUserPassword: newValue,
            })
          }
        />
        <ConcurrencyLevelField
          value={advancedValues.concurrencyLevel}
          defaultValue={jobTemplate.concurrency_control?.level}
          setValue={newValue =>
            setAdvancedValues({
              concurrencyLevel: newValue,
            })
          }
        />
        <ExecutionOrderingField
          isRandomizedOrdering={advancedValues.isRandomizedOrdering}
          setValue={newValue =>
            setAdvancedValues({
              isRandomizedOrdering: newValue,
            })
          }
        />
      </Form>
    </>
  );
};

AdvancedFields.propTypes = {
  advancedValues: PropTypes.object.isRequired,
  setAdvancedValues: PropTypes.func.isRequired,
  templateValues: PropTypes.object.isRequired,
};
export default AdvancedFields;
