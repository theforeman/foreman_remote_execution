import React from 'react';

const AggregateStatus = ({ statuses }) => (
  <div id="aggregate_statuses">
    <p className="card-pf-aggregate-status-notifications">
      <span className="card-pf-aggregate-status-notification">
        <span id="success_count">
          <span className="pficon pficon-ok" />
          {statuses.success}
        </span>
      </span>
      <span className="card-pf-aggregate-status-notification">
        <span id="failed_count">
          <span className="pficon pficon-error-circle-o" />
          {statuses.failed}
        </span>
      </span>
      <span className="card-pf-aggregate-status-notification">
        <span id="pending_count">
          <span className="pficon pficon-running" />
          {statuses.pending}
        </span>
      </span>
      <span className="card-pf-aggregate-status-notification">
        <span id="cancelled_count">
          <span className="pficon pficon-close" />
          {statuses.cancelled}
        </span>
      </span>
    </p>
  </div>
);

export default AggregateStatus;
