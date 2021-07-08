import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount } from '@theforeman/test';
import { HostSearch } from '../HostSearch';

const mockStore = configureMockStore();
const store = mockStore({});
describe('HostSearch ', () => {
  it('rendring', () => {
    const component = mount(
      <Provider store={store}>
        <HostSearch value="some query" setValue={jest.fn()} />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
});
