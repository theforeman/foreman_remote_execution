import { foremanUrl } from 'foremanReact/common/helpers';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { post } from 'foremanReact/redux/API';

export const runFeature = (hostId, feature, label) => dispatch => {
  const url = foremanUrl(
    `/job_invocations?feature=${feature}&host_ids%5B%5D=${hostId}`
  );
  const redirectUrl = 'job_invocations/new';

  const successToast = ({ request }) => {
    if (request.responseURL.includes(redirectUrl)) {
      return __('Opening job invocation form');
    }
    return sprintf(__('%s job has been invoked'), label);
  };
  const errorToast = ({ message }) => message;
  dispatch(
    post({
      key: feature.toUpperCase(),
      url,
      successToast,
      errorToast,
      handleSuccess: ({ request }) => {
        if (request.responseURL.includes(redirectUrl)) {
          // checking if user should be redicted to finish setting up the job
          window.location.href = request.responseURL;
        }
      },
    })
  );
};
