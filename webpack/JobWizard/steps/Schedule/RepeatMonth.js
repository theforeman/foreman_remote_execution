import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, FormGroup } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { RepeatDaily } from './RepeatDaily';

export const RepeatMonth = ({ repeatData, setRepeatData }) => (
  <>
    <FormGroup label={__('Days')}>
      <TextInput
        aria-label="days"
        placeholder="1,2..."
        type="text"
        value={repeatData.days || ''}
        onChange={newTime => {
          setRepeatData({ ...repeatData, days: newTime });
        }}
      />
    </FormGroup>
    <RepeatDaily repeatData={repeatData} setRepeatData={setRepeatData} />
  </>
);

RepeatMonth.propTypes = {
  repeatData: PropTypes.object.isRequired,
  setRepeatData: PropTypes.func.isRequired,
};
