import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import RecentJobsCard from '../components/RecentJobsCard';

export default () =>
  addGlobalFill(
    'details-cards',
    'rex-host-details-latest-jobs',
    <RecentJobsCard />,
    1000
  );
