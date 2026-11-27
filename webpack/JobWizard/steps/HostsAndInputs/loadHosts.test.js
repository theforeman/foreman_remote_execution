import { post } from 'foremanReact/redux/API';
import { HOSTS_API, HOSTS_TO_PREVIEW_AMOUNT } from '../../JobWizardConstants';
import { loadHosts } from './loadHosts';

jest.mock('foremanReact/redux/API');

describe('loadHosts', () => {
  it('sends long searches in a POST request body', () => {
    const hosts = Array(1000)
      .fill('host.example.com')
      .join(',');
    const search = `name ^ (${hosts})`;

    loadHosts(search);

    expect(post).toHaveBeenCalledWith({
      key: HOSTS_API,
      url: '/ui_job_wizard/hosts',
      params: {
        search,
        per_page: HOSTS_TO_PREVIEW_AMOUNT,
      },
    });
  });
});
