import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, fireEvent, screen } from '@testing-library/react';
import { ChipGroup } from '@patternfly/react-core';
import { HostSelect } from '../HostSelect';

const patternfly = { ChipGroup }; // https://github.com/aelbore/esbuild-jest/issues/26#issuecomment-893763840
jest.spyOn(patternfly, 'ChipGroup');
patternfly.ChipGroup.mockImplementation(props => <div props={props} />);

const apiKey = 'HOSTS_KEY';

const mockStore = configureMockStore([]);
describe('HostSelect', () => {
  it('too many', () => {
    const tooManyHostsStore = mockStore({
      [apiKey]: {
        response: {
          subtotal: 101,
          results: [{ name: 'host1' }, { name: 'host2' }, { name: 'host3' }],
        },
      },
    });
    const { container } = render(
      <Provider store={tooManyHostsStore}>
        <HostSelect
          selectedHosts={['hosts1,host2']}
          setSelectedHosts={jest.fn()}
          apiKey={apiKey}
          url="/hosts"
          placeholderText="Test hosts"
        />
      </Provider>
    );
    const openSelectbutton = container.querySelector(
      '.pf-c-select__toggle-arrow'
    );
    fireEvent.click(openSelectbutton);
    const tooManyHosts = screen.queryAllByText(
      'You have %s hosts to display. Please refine your search. + 101'
    );
    expect(tooManyHosts).toHaveLength(1);
  });
});
