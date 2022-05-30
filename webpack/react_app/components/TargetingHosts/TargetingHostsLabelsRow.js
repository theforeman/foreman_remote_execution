import React from 'react';
import PropTypes from 'prop-types';
import { Row, Label } from 'patternfly-react';
import { noop } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';

import './TargetingHostsLabelsRow.scss';

const TargetingHostsLabelsRow = ({ query, updateQuery }) => {
  const onDeleteClick = keyToDelete => {
    const { [keyToDelete]: deleted, ...queryWithoutDeleted } = query;
    updateQuery(queryWithoutDeleted);
  };

  const queryEntries = Object.entries(query);

  return (
    queryEntries.length > 0 && (
      <Row className="tasks-labels-row">
        <span className="title">{__('Active Filters:')}</span>
        {queryEntries.map(([key, value]) => (
          <Label
            bsStyle="info"
            key={key}
            onRemoveClick={() => onDeleteClick(key)}
          >
            {`${key} = ${value}`}
          </Label>
        ))}
      </Row>
    )
  );
};

TargetingHostsLabelsRow.propTypes = {
  query: PropTypes.object,
  updateQuery: PropTypes.func,
};

TargetingHostsLabelsRow.defaultProps = {
  query: {},
  updateQuery: noop,
};

export default TargetingHostsLabelsRow;
