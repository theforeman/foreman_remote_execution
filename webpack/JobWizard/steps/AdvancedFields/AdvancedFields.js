import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Form } from '@patternfly/react-core';
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

export const AdvancedFields = ({ advancedValue, setAdvancedValue }) => {
  const jobTemplate = useSelector(selectJobTemplate);
  const effectiveUser = jobTemplate.effective_user;
  return (
    <Form>
      {effectiveUser?.overridable && (
        <EffectiveUserField
          value={advancedValue.effectiveUserValue}
          setValue={newValue =>
            setAdvancedValue({
              effectiveUserValue: newValue,
            })
          }
        />
      )}
      <TimeoutToKillField
        value={advancedValue.timeoutToKill}
        setValue={newValue =>
          setAdvancedValue({
            timeoutToKill: newValue,
          })
        }
      />
      <PasswordField
        value={advancedValue.password}
        setValue={newValue =>
          setAdvancedValue({
            password: newValue,
          })
        }
      />
      <KeyPassphraseField
        value={advancedValue.keyPassphrase}
        setValue={newValue =>
          setAdvancedValue({
            keyPassphrase: newValue,
          })
        }
      />
      <EffectiveUserPasswordField
        value={advancedValue.effectiveUserPassword}
        setValue={newValue =>
          setAdvancedValue({
            effectiveUserPassword: newValue,
          })
        }
      />
      <ConcurrencyLevelField
        value={advancedValue.concurrencyLevel}
        setValue={newValue =>
          setAdvancedValue({
            concurrencyLevel: newValue,
          })
        }
      />
      <TimeSpanLevelField
        value={advancedValue.timeSpan}
        setValue={newValue =>
          setAdvancedValue({
            timeSpan: newValue,
          })
        }
      />
    </Form>
  );
};

AdvancedFields.propTypes = {
  advancedValue: PropTypes.object.isRequired,
  setAdvancedValue: PropTypes.func.isRequired,
};
export default AdvancedFields;
