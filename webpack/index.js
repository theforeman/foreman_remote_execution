import URI from 'urijs';
import { mount, registerReducer } from 'foremanReact/common/MountingService';
import componentRegistry from 'foremanReact/components/componentRegistry';
import JobInvocationContainer from './react_app/components/jobInvocations';
import rootReducer from './react_app/redux/reducers';
import 'react';

componentRegistry.register({
  name: 'JobInvocationContainer',
  type: JobInvocationContainer,
});

registerReducer('foremanRemoteExecutionReducers', rootReducer);

if (window.location.href.match(/job_invocations/)) {
  const jobInvocationId = parseInt(
    new URI(window.location.href).filename(),
    10,
  );
  mount('JobInvocationContainer', '#status_chart', {
    url: `/job_invocations/chart?id=${jobInvocationId}`,
  });
}
