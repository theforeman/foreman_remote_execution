import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import NewJobAction from '../host/NewJobAction';

export default () =>
  addGlobalFill(
    'host-details-kebab',
    'rex-host-details-kebab-job',
    <NewJobAction withIcon withSeprator key="rex-host-details-kebab-job" />,
    100
  );
