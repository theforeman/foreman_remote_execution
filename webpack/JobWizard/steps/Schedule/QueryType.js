import { FormGroup, Radio } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';
import React from 'react';
import { helpLabel } from '../form/FormHelpers';

export const QueryType = ({ isTypeStatic, setIsTypeStatic }) => (
  <>
    <FormGroup
      label={__('Query type')}
      fieldId="query-type-static"
      labelIcon={helpLabel(
        __('Type has impact on when is the query evaluated to hosts.'),
        'query-type'
      )}
    >
      <Radio
        isChecked={isTypeStatic}
        name="query-type"
        onChange={() => setIsTypeStatic(true)}
        id="query-type-static"
        label={__('Static query')}
        body={__('evaluates just after you submit this form')}
      />
    </FormGroup>
    <FormGroup fieldId="query-type-dynamic">
      <Radio
        isChecked={!isTypeStatic}
        name="query-type"
        onChange={() => setIsTypeStatic(false)}
        id="query-type-dynamic"
        label={__('Dynamic query')}
        body={__(
          "evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it"
        )}
      />
    </FormGroup>
  </>
);

QueryType.propTypes = {
  isTypeStatic: PropTypes.bool.isRequired,
  setIsTypeStatic: PropTypes.func.isRequired,
};
