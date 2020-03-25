import URI from 'urijs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, registerReducer } from 'foremanReact/common/MountingService';
// eslint-disable-next-line import/no-extraneous-dependencies
import componentRegistry from 'foremanReact/components/componentRegistry';
import JobInvocationContainer from './react_app/components/jobInvocations';
import rootReducer from './react_app/redux/reducers';

componentRegistry.register({
  name: 'JobInvocationContainer',
  type: JobInvocationContainer,
});

registerReducer('foremanRemoteExecutionReducers', rootReducer);
