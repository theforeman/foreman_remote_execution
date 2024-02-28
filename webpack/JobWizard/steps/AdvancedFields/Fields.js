import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextInput, Radio } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { helpLabel, ResetDefault } from '../form/FormHelpers';
import { formatter } from '../form/Formatter';
import { NumberInput } from '../form/NumberInput';

export const EffectiveUserField = ({ value, setValue, defaultValue }) => (
  <FormGroup
    label={__('Effective user')}
    labelIcon={helpLabel(
      __(
        'A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.'
      ),
      'effective-user'
    )}
    fieldId="effective-user"
    labelInfo={<ResetDefault setValue={setValue} defaultValue={defaultValue} />}
  >
    <TextInput
      ouiaId="effective-user"
      aria-label="effective user"
      autoComplete="effective-user"
      id="effective-user"
      type="text"
      value={value}
      onChange={newValue => setValue(newValue)}
    />
  </FormGroup>
);

export const TimeoutToKillField = ({ value, setValue, defaultValue }) => (
  <NumberInput
    formProps={{
      label: __('Timeout to kill'),
      labelIcon: helpLabel(
        __(
          'Time in seconds from the start on the remote host after which the job should be killed.'
        ),
        'timeout-to-kill'
      ),
      fieldId: 'timeout-to-kill',
      labelInfo: (
        <ResetDefault setValue={setValue} defaultValue={defaultValue} />
      ),
    }}
    inputProps={{
      value,
      placeholder: __('For example: 1, 2, 3, 4, 5...'),
      autoComplete: 'timeout-to-kill',
      id: 'timeout-to-kill',
      onChange: newValue => setValue(newValue),
    }}
  />
);
export const TimeToPickupField = ({ value, setValue }) => (
  <NumberInput
    formProps={{
      label: __('Time to pickup'),
      labelIcon: helpLabel(
        __(
          'Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled. Applies only to pull-mqtt based jobs'
        ),
        'time-to-pickup'
      ),
      fieldId: 'time-to-pickup',
    }}
    inputProps={{
      value,
      autoComplete: 'time-to-pickup',
      id: 'time-to-pickup',
      onChange: newValue => setValue(newValue),
    }}
  />
);

export const PasswordField = ({ value, setValue }) => (
  <FormGroup
    label={__('Password')}
    labelIcon={helpLabel(
      __(
        'Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.'
      ),
      'password'
    )}
    fieldId="job-password"
  >
    <TextInput
      ouiaId="job-password"
      aria-label="job password"
      autoComplete="new-password" // to prevent firefox from autofilling the user password
      id="job-password"
      type="password"
      placeholder="*****"
      value={value}
      onChange={newValue => setValue(newValue)}
    />
  </FormGroup>
);

export const KeyPassphraseField = ({ value, setValue }) => (
  <FormGroup
    label={__('Private key passphrase')}
    labelIcon={helpLabel(
      __(
        'Key passphrase is only applicable for SSH provider. Other providers ignore this field. Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.'
      ),
      'key-passphrase'
    )}
    fieldId="key-passphrase"
  >
    <TextInput
      ouiaId="key-passphrase"
      aria-label="key passphrase"
      autoComplete="key-passphrase"
      id="key-passphrase"
      type="password"
      placeholder="*****"
      value={value}
      onChange={newValue => setValue(newValue)}
    />
  </FormGroup>
);

export const EffectiveUserPasswordField = ({ value, setValue }) => (
  <FormGroup
    label={__('Effective user password')}
    labelIcon={helpLabel(
      __(
        'Effective user password is only applicable for SSH provider. Other providers ignore this field. Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.'
      ),
      'effective-user-password'
    )}
    fieldId="effective-user-password"
  >
    <TextInput
      ouiaId="effective-user-password"
      aria-label="effective userpassword"
      autoComplete="effective-user-password"
      id="effective-user-password"
      type="password"
      placeholder="*****"
      value={value}
      onChange={newValue => setValue(newValue)}
    />
  </FormGroup>
);

export const ConcurrencyLevelField = ({ value, setValue, defaultValue }) => (
  <NumberInput
    formProps={{
      label: __('Concurrency level'),
      labelIcon: helpLabel(
        __(
          'Run at most N tasks at a time. If this is set and proxy batch triggering is enabled, then tasks are triggered on the smart proxy in batches of size 1.'
        ),
        'concurrency-level'
      ),
      fieldId: 'concurrency-level',
      labelInfo: (
        <ResetDefault setValue={setValue} defaultValue={defaultValue} />
      ),
    }}
    inputProps={{
      min: 1,
      autoComplete: 'concurrency-level',
      id: 'concurrency-level',
      placeholder: __('For example: 1, 2, 3, 4, 5...'),
      value,
      onChange: newValue => setValue(newValue),
    }}
  />
);

export const ExecutionOrderingField = ({ isRandomizedOrdering, setValue }) => (
  <FormGroup
    label={__('Execution ordering')}
    fieldId="schedule-type"
    labelIcon={helpLabel(
      <div
        dangerouslySetInnerHTML={{
          __html: __(
            'Execution ordering determines whether the jobs should be executed on hosts in alphabetical order or in randomized order.<br><ul><li><b>Ordered</b> - executes the jobs on hosts in alphabetical order</li><li><b>Randomized</b> - randomizes the order in which jobs are executed on hosts</li></ul>'
          ),
        }}
      />,
      'effective-user-password'
    )}
    isInline
  >
    <Radio
      ouiaId="execution-order-alphabetical"
      aria-label="execution order alphabetical"
      isChecked={!isRandomizedOrdering}
      name="execution-order"
      onChange={() => setValue(false)}
      id="execution-order-alphabetical"
      label={__('Alphabetical')}
    />
    <Radio
      ouiaId="execution-order-randomized"
      aria-label="execution order randomized"
      isChecked={isRandomizedOrdering}
      name="execution-order"
      onChange={() => setValue(true)}
      id="execution-order-randomized"
      label={__('Randomized')}
    />
  </FormGroup>
);

export const TemplateInputsFields = ({ inputs, value, setValue }) => (
  <>{inputs?.map(input => formatter(input, value, setValue))}</>
);

export const SSHUserField = ({ value, setValue, defaultValue }) => (
  <FormGroup
    label={__('SSH user')}
    labelIcon={helpLabel(__('A user to be used for SSH.'), 'ssh-user')}
    fieldId="ssh-user"
    labelInfo={<ResetDefault setValue={setValue} defaultValue={defaultValue} />}
  >
    <TextInput
      ouiaId="ssh-user"
      aria-label="ssh user"
      autoComplete="ssh-user"
      id="ssh-user"
      type="text"
      value={value}
      onChange={newValue => setValue(newValue)}
    />
  </FormGroup>
);

EffectiveUserField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setValue: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
EffectiveUserField.defaultProps = {
  value: '',
  defaultValue: null,
};

TimeoutToKillField.propTypes = EffectiveUserField.propTypes;
TimeoutToKillField.defaultProps = EffectiveUserField.defaultProps;
TimeToPickupField.propTypes = EffectiveUserField.propTypes;
TimeToPickupField.defaultProps = EffectiveUserField.defaultProps;
PasswordField.propTypes = EffectiveUserField.propTypes;
PasswordField.defaultProps = EffectiveUserField.defaultProps;
KeyPassphraseField.propTypes = EffectiveUserField.propTypes;
KeyPassphraseField.defaultProps = EffectiveUserField.defaultProps;
EffectiveUserPasswordField.propTypes = EffectiveUserField.propTypes;
EffectiveUserPasswordField.defaultProps = EffectiveUserField.defaultProps;
ConcurrencyLevelField.propTypes = EffectiveUserField.propTypes;
ConcurrencyLevelField.defaultProps = EffectiveUserField.defaultProps;
ExecutionOrderingField.propTypes = {
  isRandomizedOrdering: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
};
ExecutionOrderingField.defaultProps = {
  isRandomizedOrdering: false,
};

TemplateInputsFields.propTypes = {
  inputs: PropTypes.array.isRequired,
  value: PropTypes.object,
  setValue: PropTypes.func.isRequired,
};

TemplateInputsFields.defaultProps = {
  value: {},
};

SSHUserField.propTypes = EffectiveUserField.propTypes;
SSHUserField.defaultProps = EffectiveUserField.defaultProps;
