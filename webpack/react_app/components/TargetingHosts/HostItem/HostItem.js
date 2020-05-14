import React from 'react';
import PropTypes from 'prop-types';
import HostStatus from '../HostStatus/HostStatus.js';
import HostActions from '../HostActions/HostActions.js';

const HostItem = (props) => {
  const {
    name, link, status, actions,
  } = props.host;

  const renderName = () => {
    if (link !== '' || link !== undefined) {
      return (<a href={link}>{name}</a>);
    }
    return (<a href="#" className="disabled">{name}</a>);
  };

  return (
    <tr>
      <td className="host_name">
        { renderName() }
      </td>
      <td className="host_status">
        <HostStatus status={status} />
      </td>
      <td className="host_actions">
        <HostActions actions={actions} />
      </td>
    </tr>

  );
};

HostItem.propTypes = {
  host: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    actions: PropTypes.array,
  }),
};

export default HostItem;
