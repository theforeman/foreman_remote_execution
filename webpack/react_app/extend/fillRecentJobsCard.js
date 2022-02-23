import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import RecentJobsCard from '../components/RecentJobsCard';

export default () =>
  addGlobalFill(
    'host-overview-cards',
    'rex-host-details-latest-jobs',
    <RecentJobsCard key="rex-host-details-latest-jobs" />,
    1000
  );
