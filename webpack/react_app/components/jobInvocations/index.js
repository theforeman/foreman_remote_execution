import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import PieChart from 'foremanReact/components/common/charts/PieChart';
import AggregateStatus from './AggregateStatus/index.js';
import * as JobInvocationActions from '../../redux/actions/jobInvocations';

class JobInvocationContainer extends React.Component {
  componentDidMount() {
    const { startJobInvocationsPolling, data: { url } } = this.props;

    startJobInvocationsPolling(url);
  }

  render() {
    const { jobInvocations, statuses } = this.props;

    return (
      <div id="job_invocations_chart_container">
        <PieChart data={jobInvocations} />
        <AggregateStatus statuses={statuses} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
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
  data: PropTypes.string,
  jobInvocations: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.string,
    PropTypes.number,
    PropTypes.string,
  )),
  statuses: PropTypes.shape({}),
};

JobInvocationContainer.defaultProps = {
  startJobInvocationsPolling: JobInvocationActions.startJobInvocationsPolling,
  data: '',
  jobInvocations: [['property', 3, 'color']],
  statuses: {},
};
export default connect(mapStateToProps, JobInvocationActions)(JobInvocationContainer);
