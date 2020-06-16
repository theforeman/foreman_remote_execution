import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';

const ApiError = () => (
  <div className="alert alert-danger">
    <span className="pficon pficon-error-circle-o " />
    <span className="text">
      {__(
        'There was an error while updating the status, try refreshing the page.'
      )}
    </span>
  </div>
);

export default ApiError;
