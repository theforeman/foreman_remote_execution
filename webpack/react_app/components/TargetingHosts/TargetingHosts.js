import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { LoadingState } from 'patternfly-react';
import { STATUS } from 'foremanReact/constants';
import HostItem from './components/HostItem';
import ApiError from './components/ApiError';

const TargetingHosts = ({ status, items }) => {
  if (status === STATUS.ERROR) {
    return <ApiError />;
  }

  return (
    <LoadingState loading={!items.length}>
      <div>
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>{__('Host')}</th>
              <th>{__('Status')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(host => (
              <HostItem
                key={host.name}
                name={host.name}
                link={host.link}
                status={host.status}
                actions={host.actions}
              />
            ))}
          </tbody>
        </table>
      </div>
    </LoadingState>
  );
};

TargetingHosts.propTypes = {
  status: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default TargetingHosts;
