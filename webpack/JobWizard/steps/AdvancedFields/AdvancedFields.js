import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Title, Form } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { selectJobTemplate } from '../../JobWizardSelectors';
import {
  EffectiveUserField,
  TimeoutToKillField,
  PasswordField,
  KeyPassphraseField,
  EffectiveUserPasswordField,
  ConcurrencyLevelField,
  TimeSpanLevelField,
} from './Fields';

export const AdvancedFields = ({ advancedValues, setAdvancedValues }) => {
  const jobTemplate = useSelector(selectJobTemplate);
  const effectiveUser = jobTemplate.effective_user;
  return (
    <>
      <Title headingLevel="h2" className="advanced-fields-title">
        {__('Advanced Fields')}
      </Title>
      <Form>
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
