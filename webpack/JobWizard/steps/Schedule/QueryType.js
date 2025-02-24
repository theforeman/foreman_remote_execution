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
        ouiaId="query-type-static"
        isChecked={isTypeStatic}
        name="query-type"
        onChange={() => setIsTypeStatic(true)}
        id="query-type-static"
        label={__('Static query')}
        body={__('Executes the job on the current list of target hosts.')}
      />
    </FormGroup>
    <FormGroup fieldId="query-type-dynamic">
      <Radio
        ouiaId="query-type-dynamic"
        isChecked={!isTypeStatic}
        name="query-type"
        onChange={() => setIsTypeStatic(false)}
        id="query-type-dynamic"
        label={__('Dynamic query')}
        body={__(
          "Evaluates the list of target hosts just before the job is executed. If you used a filter to select the target hosts, the list of target hosts might be different from the current list."
        )}
      />
    </FormGroup>
  </>
);

QueryType.propTypes = {
  isTypeStatic: PropTypes.bool.isRequired,
  setIsTypeStatic: PropTypes.func.isRequired,
};
