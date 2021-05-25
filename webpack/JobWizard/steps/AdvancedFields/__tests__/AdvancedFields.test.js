import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import * as patternfly from '@patternfly/react-core';
import { mount } from '@theforeman/test';
import { AdvancedFields } from '../AdvancedFields';

jest.spyOn(patternfly, 'FormGroup');
patternfly.FormGroup.mockImplementation(props => (
  <div>{props.navAriaLabel}</div>
));
const mockStore = configureMockStore([]);
const store = mockStore({
  JOB_TEMPLATE: { response: { effective_user: { overridable: true } } },
});
describe('AdvancedFields', () => {
  it('rendring', () => {
    const component = mount(
      <Provider store={store}>
        <AdvancedFields advancedValues={{}} setAdvancedValues={jest.fn()} />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
});
