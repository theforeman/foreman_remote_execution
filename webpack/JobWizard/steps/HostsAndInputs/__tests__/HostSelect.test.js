import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, fireEvent, screen } from '@testing-library/react';
import * as patternfly from '@patternfly/react-core';
import { mount } from '@theforeman/test';
import { HostSelect } from '../HostSelect';
import { hostsStore } from './HostsAndInputs.fixtures';

jest.spyOn(patternfly, 'ChipGroup');
patternfly.ChipGroup.mockImplementation(props => <div props={props} />);

const apiKey = 'HOSTS_KEY';

const mockStore = configureMockStore([]);
describe('HostSelect', () => {
  it('rendering', () => {
    const component = mount(
      <Provider store={hostsStore}>
        <HostSelect
          selectedHosts={['hosts1,host2']}
          setSelectedHosts={jest.fn()}
          apiKey={apiKey}
          url="/hosts"
          placeholderText="Test hosts"
        />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
  it('too many', () => {
    const tooManyHostsStore = mockStore({
      [apiKey]: {
        subtotal: 101,
        results: [{ name: 'host1' }, { name: 'host2' }, { name: 'host3' }],
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
