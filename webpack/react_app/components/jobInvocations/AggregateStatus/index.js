import React from 'react';
import PropTypes from 'prop-types';

const AggregateStatus = ({ statuses, chartFilter }) => (
  <div id="aggregate_statuses">
    <p className="card-pf-aggregate-status-notifications">
      <a
        className="card-pf-aggregate-status-notification"
        onClick={() => chartFilter('success')}
      >
        <span id="success_count">
          <span className="pficon pficon-ok" />
          {statuses.success}
        </span>
      </a>

      <a
        className="card-pf-aggregate-status-notification"
        onClick={() => chartFilter('failed')}
      >
        <span id="failed_count">
          <span className="pficon pficon-error-circle-o" />
          {statuses.failed}
        </span>
      </a>

      <a
        className="card-pf-aggregate-status-notification"
        onClick={() => chartFilter('pending')}
      >
        <span id="pending_count">
          <span className="pficon pficon-running" />
          {statuses.pending}
        </span>
      </a>

      <a
        className="card-pf-aggregate-status-notification"
        onClick={() => chartFilter('cancelled')}
      >
        <span id="cancelled_count">
          <span className="pficon pficon-close" />
          {statuses.cancelled}
        </span>
      </a>
    </p>
  </div>
);

AggregateStatus.propTypes = {
  statuses: PropTypes.shape({
    cancelled: PropTypes.number,
    failed: PropTypes.number,
    pending: PropTypes.number,
    success: PropTypes.number,
  }).isRequired,
  chartFilter: PropTypes.func.isRequired,
};

export default AggregateStatus;
