import React, { useState } from 'react';
import { FormGroup, Radio } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const ScheduleType = () => {
  const [isFuture, setIsFuture] = useState(false);
  return (
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
};
