import { get } from 'foremanReact/redux/API';
import {
  withInterval,
  stopInterval,
} from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { JOB_INVOCATION_KEY } from './JobInvocationConstants';

export const getData = url => dispatch => {
  const fetchData = withInterval(
    get({
      key: JOB_INVOCATION_KEY,
      params: { include_permissions: true },
      url,
      handleError: () => {
        dispatch(stopInterval(JOB_INVOCATION_KEY));
      },
    }),
    1000
  );

  dispatch(fetchData);
};
