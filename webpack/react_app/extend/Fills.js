import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import FeaturesDropdown from '../components/FeaturesDropdown';
import RexInterface from '../components/RegistrationExtension/RexInterface';
import RexPull from '../components/RegistrationExtension/RexPull';
import RecentJobsCard from '../components/RecentJobsCard';
import KebabItems from '../components/HostKebab/KebabItems';

const fills = [
  {
    slot: 'host-details-kebab',
    name: 'kebab-items',
    component: props => <KebabItems {...props} />,
    weight: 500,
  },
  {
    slot: 'host-overview-cards',
    name: 'latest-jobs',
    component: props => <RecentJobsCard {...props} />,
    weight: 3200,
  },
  {
    slot: 'registrationAdvanced',
    name: 'interface',
    component: props => <RexInterface {...props} />,
    weight: 500,
  },
  {
    slot: 'registrationAdvanced',
    name: 'pull',
    component: props => <RexPull {...props} />,
    weight: 500,
  },
  {
    slot: '_rex-host-features',
    name: '_rex-host-features',
    component: props => <FeaturesDropdown {...props} />,
    weight: 1000,
  },
];

const registerFills = () => {
  fills.forEach(({ slot, id, component: Component, weight, metadata }) =>
    addGlobalFill(
      slot,
      id,
      <Component key={`rex-fill-${id}`} />,
      weight,
      metadata
    )
  );
};

export default registerFills;
