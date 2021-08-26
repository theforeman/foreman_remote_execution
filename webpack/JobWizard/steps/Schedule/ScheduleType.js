import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Radio } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const ScheduleType = ({ isFuture, setIsFuture }) => (
  <FormGroup label={__('Schedule type')} fieldId="schedule-type">
    <Radio
      isChecked={!isFuture}
      name="schedule-type"
      onChange={() => setIsFuture(false)}
      id="schedule-type-now"
      label={__('Execute now')}
    />
    <Radio
      isChecked={isFuture}
      name="schedule-type"
      onChange={() => setIsFuture(true)}
      id="schedule-type-future"
      label={__('Schedule for future execution')}
    />
  </FormGroup>
);

ScheduleType.propTypes = {
  isFuture: PropTypes.bool.isRequired,
  setIsFuture: PropTypes.func.isRequired,
};
