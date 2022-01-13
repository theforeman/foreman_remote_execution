import { foremanUrl } from 'foremanReact/common/helpers';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { post } from 'foremanReact/redux/API';

export const runFeature = (hostId, feature, label) => dispatch => {
  const url = foremanUrl(
    `/job_invocations?feature=${feature}&host_ids%5B%5D=${hostId}`
  );

  const successToast = () => sprintf(__('%s job has been invoked'), label);
  const errorToast = ({ message }) => message;
  dispatch(post({ key: feature.toUpperCase(), url, successToast, errorToast }));
};
