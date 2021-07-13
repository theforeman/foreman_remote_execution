import React from 'react';
import { mount } from '@theforeman/test';
import { DescriptionField } from '../DescriptionField';

describe('DescriptionField', () => {
  it('rendring', () => {
    const component = mount(
      <DescriptionField
        inputs={[{ name: 'command' }]}
        value="Run %{command}"
        setValue={jest.fn()}
      />
    );
    const preview = component.find('#description-preview').hostNodes();
    const findLink = () => component.find('.pf-m-link.pf-m-inline');
    expect(findLink().text()).toEqual('Edit job description template');
    expect(preview.props().value).toEqual('Run command');
    findLink().simulate('click');
    const description = component.find('#description').hostNodes();
    expect(description.props().value).toEqual('Run %{command}');
    expect(findLink().text()).toEqual('Preview job description');
  });
});
