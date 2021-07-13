import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Title, Form } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  selectEffectiveUser,
  selectAdvancedTemplateInputs,
  selectTemplateInputs,
} from '../../JobWizardSelectors';
import {
  EffectiveUserField,
  TimeoutToKillField,
  PasswordField,
  KeyPassphraseField,
  EffectiveUserPasswordField,
  ConcurrencyLevelField,
  TimeSpanLevelField,
  TemplateInputsFields,
} from './Fields';
import { DescriptionField } from './DescriptionField';

export const AdvancedFields = ({ advancedValues, setAdvancedValues }) => {
  const effectiveUser = useSelector(selectEffectiveUser);
  const advancedTemplateInputs = useSelector(selectAdvancedTemplateInputs);
  const templateInputs = useSelector(selectTemplateInputs);
  return (
    <>
      <Title headingLevel="h2" className="advanced-fields-title">
        {__('Advanced Fields')}
      </Title>
      <Form id="advanced-fields-job-template" autoComplete="off">
        <TemplateInputsFields
          inputs={advancedTemplateInputs}
          value={advancedValues.templateValues}
          setValue={newValue => setAdvancedValues({ templateValues: newValue })}
        />
        {effectiveUser?.overridable && (
          <EffectiveUserField
            value={advancedValues.effectiveUserValue}
            setValue={newValue =>
              setAdvancedValues({
                effectiveUserValue: newValue,
              })
            }
          />
        )}
        <DescriptionField
          inputs={templateInputs}
          value={advancedValues.description}
          setValue={newValue => setAdvancedValues({ description: newValue })}
        />
        <TimeoutToKillField
          value={advancedValues.timeoutToKill}
          setValue={newValue =>
            setAdvancedValues({
              timeoutToKill: newValue,
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
          setValue={newValue =>
            setAdvancedValues({
              concurrencyLevel: newValue,
            })
          }
        />
        <TimeSpanLevelField
          value={advancedValues.timeSpan}
          setValue={newValue =>
            setAdvancedValues({
              timeSpan: newValue,
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
};
export default AdvancedFields;
