import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import * as patternfly from '@patternfly/react-core';
import { mount } from '@theforeman/test';
import HostsAndInputs from '../';

jest.spyOn(patternfly, 'FormGroup');
patternfly.FormGroup.mockImplementation(props => <div props={props} />);

const mockStore = configureMockStore([]);
const store = mockStore({
  template_inputs_with_foreign: [],
});
describe('HostsAndInputs', () => {
  it('rendering', () => {
    const component = mount(
      <Provider store={store}>
        <HostsAndInputs
          templateValues={{}}
          setTemplateValues={jest.fn()}
          selectedHosts={['host1']}
          setSelectedHosts={jest.fn()}
        />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
});
