import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput, FormGroup, ValidatedOptions } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { RepeatDaily } from './RepeatDaily';
import { noop } from '../../../helpers';

export const RepeatMonth = ({ repeatData, setRepeatData, setValid }) => {
  const { days, at } = repeatData;
  useEffect(() => {
    if (days && at) {
      setValid(true);
    } else {
      setValid(false);
    }
    return () => setValid(true);
  }, [setValid, days, at]);
  return (
    <>
      <FormGroup label={__('Days')} isRequired>
        <TextInput
          isRequired
          validated={days ? ValidatedOptions.noval : ValidatedOptions.error}
          aria-label="days"
          placeholder="1,2..."
          type="text"
          value={repeatData.days || ''}
          onChange={newTime => {
            setRepeatData({ ...repeatData, days: newTime });
          }}
        />
      </FormGroup>
      <RepeatDaily
        repeatData={repeatData}
        setRepeatData={setRepeatData}
        setValid={noop}
      />
    </>
  );
};

RepeatMonth.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
  setValid: PropTypes.func.isRequired,
};
