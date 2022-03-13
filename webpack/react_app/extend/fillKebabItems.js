import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import KebabItems from '../components/HostKebab/KebabItems';

export default () =>
  addGlobalFill(
    'host-details-kebab',
    'rex-host-details-kebab-job',
    <KebabItems key="rex-host-details-kebab-job" />,
    100
  );
