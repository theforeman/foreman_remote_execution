import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { routerMiddleware } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import URI from 'urijs';

import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { STATUS } from 'foremanReact/constants';
import FeaturesDropdown from '../index';

jest.unmock('foremanReact/common/helpers');
jest.mock('foremanReact/common/hooks/API/APIHooks');

it('preserves a literal plus in the host search when scheduling a job', () => {
  const hostSearch = 'name = "rabl-repro" or name = "marker+test"';
  const history = createMemoryHistory();
  const store = configureMockStore([routerMiddleware(history)])({});

  useAPI.mockReturnValue({ response: { results: [] }, status: STATUS.RESOLVED });

  render(
    <Provider store={store}>
      <FeaturesDropdown
        hostSearch={hostSearch}
        hostResponse={{ response: { can_create_job_invocations: true } }}
        selectedCount={1}
      />
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Schedule a job' }));

  expect(history.location.pathname).toBe('/job_invocations/new');
  expect(URI.parseQuery(history.location.search).search).toBe(hostSearch);
});
