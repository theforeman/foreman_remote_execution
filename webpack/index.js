import URI from 'urijs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, registerReducer } from 'foremanReact/common/MountingService';
// eslint-disable-next-line import/no-extraneous-dependencies
import componentRegistry from 'foremanReact/components/componentRegistry';
import JobInvocationContainer from './react_app/components/jobInvocations';
import TargetingHosts from './react_app/components/TargetingHosts/TargetingHosts.js';
import HostStatus from './react_app/components/TargetingHosts/HostStatus/HostStatus.js';
import HostActions from './react_app/components/TargetingHosts/HostActions/HostActions.js';
import HostItem from './react_app/components/TargetingHosts/HostItem/HostItem.js';
import rootReducer from './react_app/redux/reducers';

componentRegistry.register({
  name: 'JobInvocationContainer',
  type: JobInvocationContainer,
});
componentRegistry.register({ name: 'TargetingHosts', type: TargetingHosts });
componentRegistry.register({ name: 'HostStatus', type: HostStatus });
componentRegistry.register({ name: 'HostActions', type: HostActions });
componentRegistry.register({ name: 'HostItem', type: HostItem });

registerReducer('foremanRemoteExecutionReducers', rootReducer);
