import { post } from 'foremanReact/redux/API';
import { HOSTS_API, HOSTS_TO_PREVIEW_AMOUNT } from '../../JobWizardConstants';

export const loadHosts = search =>
  post({
    key: HOSTS_API,
    url: '/ui_job_wizard/hosts',
    params: {
      search,
      per_page: HOSTS_TO_PREVIEW_AMOUNT,
    },
  });
