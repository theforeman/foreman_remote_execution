import React from 'react';
import PropTypes from 'prop-types';

const HostActions = (props) => {
  const { actions } = props;

  if (actions === undefined || actions.length === 0) {
    return ('');
  }

  if (actions.length === 1) {
    return (<a href={actions[0].path} className="btn btn-sm btn-default">{actions[0].name}</a>);
  }
  return (
      <div className="btn-group">
        <span className="btn btn-sm btn-default">
          <a href={actions[0].path}>
            {actions[0].name}
          </a>
        </span>
        <a className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" href="#">
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu pull-right">
          { actions.slice(1, actions.length).map(link =>
            <li key={link.path}>
              <a href={link.path}>{link.name}</a>
            </li>)}
        </ul>
      </div>
  );
};

HostActions.propTypes = {
  actions: PropTypes.array,
};

export default HostActions;
