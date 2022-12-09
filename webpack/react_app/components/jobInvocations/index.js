import { connect } from 'react-redux';
import React from 'react';
import Immutable from 'seamless-immutable';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import DonutChart from 'foremanReact/components/common/charts/DonutChart';
import AggregateStatus from './AggregateStatus';
import * as JobInvocationActions from '../../redux/actions/jobInvocations';

const colIndexOfMaxValue = columns =>
  columns.reduce((iMax, x, i, arr) => (x[1] > arr[iMax][1] ? i : iMax), 0);

const colorMap = {
  '#5CB85C': 'success',
  '#D9534F': 'failed',
  '#DEDEDE': 'pending',
  '#B7312D': 'cancelled',
};

class JobInvocationContainer extends React.Component {
  componentDidMount() {
    const {
      startJobInvocationsPolling,
      data: { url },
    } = this.props;

    startJobInvocationsPolling(url);
  }

  render() {
    const { jobInvocations, statuses, chartFilter } = this.props;
    const iMax = colIndexOfMaxValue(jobInvocations);

    const map = jobInvocations.reduce(
      (acc, [label, _count, color]) => ({ [label]: colorMap[color], ...acc }),
      {}
    );

    return (
      <div id="job_invocations_chart_container">
        <DonutChart
          data={Immutable.asMutable(jobInvocations)}
          title={{
            type: 'percent',
            secondary: (jobInvocations[iMax] || [])[0],
          }}
          onclick={(d, element) => {
            chartFilter(map[d.name]);
          }}
        />
        <AggregateStatus statuses={statuses} chartFilter={chartFilter} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    jobInvocations,
    statuses,
  } = state.foremanRemoteExecutionReducers.jobInvocations;

  return {
    jobInvocations,
    statuses,
  };
};

JobInvocationContainer.propTypes = {
  startJobInvocationsPolling: PropTypes.func,
  data: PropTypes.shape({
    url: PropTypes.string,
  }),
  jobInvocations: PropTypes.arrayOf(PropTypes.array),
  statuses: PropTypes.shape({
    cancelled: PropTypes.number,
    failed: PropTypes.number,
    pending: PropTypes.number,
    success: PropTypes.number,
  }),
  chartFilter: PropTypes.func,
};

JobInvocationContainer.defaultProps = {
  startJobInvocationsPolling: JobInvocationActions.startJobInvocationsPolling,
  chartFilter: JobInvocationActions.chartFilter,
  data: {},
  jobInvocations: [['property', 3, 'color']],
  statuses: {},
};
export default connect(
  mapStateToProps,
  JobInvocationActions
)(JobInvocationContainer);
