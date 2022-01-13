import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import FeaturesDropdown from '../components/FeaturesDropdown';

export default () =>
  addGlobalFill(
    '_rex-host-features',
    '_rex-host-features',
    <FeaturesDropdown key="_rex-host-features" />,
    1000
  );
