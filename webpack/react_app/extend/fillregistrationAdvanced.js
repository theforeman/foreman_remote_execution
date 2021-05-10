import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import RexInterface from '../components/RegistrationExtension/RexInterface';

export default () =>
  addGlobalFill(
    'registrationAdvanced',
    'foreman-remote-exectuion-rex-interface',
    <RexInterface key="registration-rex-interface" />,
    100
  );
