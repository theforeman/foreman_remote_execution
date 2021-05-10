import componentRegistry from 'foremanReact/components/componentRegistry';
import JobInvocationContainer from './react_app/components/jobInvocations';
import TargetingHosts from './react_app/components/TargetingHosts';
import registerReducers from './react_app/extend/reducers';

registerReducers();

const components = [
  { name: 'JobInvocationContainer', type: JobInvocationContainer },
  { name: 'TargetingHosts', type: TargetingHosts },
];

components.forEach(component => {
  componentRegistry.register(component);
});
