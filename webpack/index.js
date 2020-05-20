import { registerReducer } from 'foremanReact/common/MountingService';
import componentRegistry from 'foremanReact/components/componentRegistry';
import JobInvocationContainer from './react_app/components/jobInvocations';
import TargetingHosts from './react_app/components/TargetingHosts/TargetingHosts';
import HostStatus from './react_app/components/TargetingHosts/HostStatus/HostStatus';
import HostItem from './react_app/components/TargetingHosts/HostItem/HostItem';
import rootReducer from './react_app/redux/reducers';

const components = [
  { name: 'JobInvocationContainer', type: JobInvocationContainer },
  { name: 'TargetingHosts', type: TargetingHosts },
  { name: 'HostStatus', type: HostStatus },
  { name: 'HostItem', type: HostItem },
];

components.forEach(component => {
  componentRegistry.register(component);
});

registerReducer('foremanRemoteExecutionReducers', rootReducer);
