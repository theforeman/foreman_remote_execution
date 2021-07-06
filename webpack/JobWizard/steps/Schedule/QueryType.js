import React, { useState } from 'react';
import { FormGroup, Radio } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { helpLabel } from '../form/FormHelpers';

export const QueryType = () => {
  const [isTypeStatic, setIsTypeStatic] = useState(true);
  return (
    <FormGroup
      label={__('Query type')}
      fieldId="query-type"
      labelIcon={helpLabel(
        <p>
          {__('Type has impact on when is the query evaluated to hosts.')}
          <br />
          <ul>
            <li>
              <b>{__('Static')}</b> -{' '}
              {__('evaluates just after you submit this form')}
            </li>
            <li>
              <b>{__('Dynamic')}</b> -{' '}
              {__(
                "evaluates just before the execution is started, so if it's planed in future, targeted hosts set may change before it"
              )}
            </li>
          </ul>
        </p>,
        'query-type'
      )}
    >
      <Radio
        isChecked={isTypeStatic}
        name="query-type"
        onChange={() => setIsTypeStatic(true)}
        id="query-type-static"
        label={__('Static query')}
      />
      <Radio
        isChecked={!isTypeStatic}
        name="query-type"
        onChange={() => setIsTypeStatic(false)}
        id="query-type-dynamic"
        label={__('Dynamic query')}
      />
    </FormGroup>
  );
};
