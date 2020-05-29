import React from 'react';
import PropTypes from 'prop-types';
import { ActionButtons } from 'foremanReact/components/common/ActionButtons/ActionButtons';
import HostStatus from '../HostStatus/HostStatus';

const HostItem = ({ name, link, status, actions }) => {
  const renderName = () => {
    if (link) {
      return <a href={link}>{name}</a>;
    }
    return (
      <a href="#" className="disabled">
        {name}
      </a>
    );
  };

  return (
    <tr>
      <td className="host_name">{renderName()}</td>
      <td className="host_status">
        <HostStatus status={status} />
      </td>
      <td className="host_actions">
        <ActionButtons buttons={[...actions]} />
      </td>
    </tr>
  );
};

HostItem.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  actions: PropTypes.array,
};

HostItem.defaultProps = {
  actions: [],
};

export default HostItem;
