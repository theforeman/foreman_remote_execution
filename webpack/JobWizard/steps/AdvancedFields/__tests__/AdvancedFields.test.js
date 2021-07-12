import React from 'react';
import { Provider } from 'react-redux';
import { mount } from '@theforeman/test';
import { fireEvent, screen, render, act } from '@testing-library/react';
import * as api from 'foremanReact/redux/API';
import { JobWizard } from '../../../JobWizard';
import * as selectors from '../../../JobWizardSelectors';
import {
  jobTemplateResponse as jobTemplate,
  testSetup,
  mockApi,
} from '../../../__tests__/fixtures';

const store = testSetup(selectors, api);
mockApi(api);

jest.spyOn(selectors, 'selectEffectiveUser');
jest.spyOn(selectors, 'selectTemplateInputs');
jest.spyOn(selectors, 'selectAdvancedTemplateInputs');

selectors.selectEffectiveUser.mockImplementation(
  () => jobTemplate.effective_user
);
selectors.selectTemplateInputs.mockImplementation(
  () => jobTemplate.template_inputs
);

selectors.selectAdvancedTemplateInputs.mockImplementation(
  () => jobTemplate.advanced_template_inputs
);
describe('AdvancedFields', () => {
  it('should save data between steps for advanced fields', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <JobWizard advancedValues={{}} setAdvancedValues={jest.fn()} />
      </Provider>
    );
    // setup
    wrapper.find('.pf-c-button.pf-c-select__toggle-button').simulate('click');
    wrapper
      .find('.pf-c-select__menu-item')
      .first()
      .simulate('click');

    // test
    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-disabled')).toHaveLength(
      0
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(2)
      .simulate('click'); // Advanced step
    const effectiveUserInput = () => wrapper.find('input#effective-user');
    const advancedTemplateInput = () =>
      wrapper.find('.pf-c-form__group-control textarea');
    const effectiveUesrValue = 'effective user new value';
    const advancedTemplateInputValue = 'advanced input new value';
    effectiveUserInput().getDOMNode().value = effectiveUesrValue;

    effectiveUserInput().simulate('change');
    wrapper.update();
    advancedTemplateInput().getDOMNode().value = advancedTemplateInputValue;
    advancedTemplateInput().simulate('change');
    expect(effectiveUserInput().prop('value')).toEqual(effectiveUesrValue);
    expect(advancedTemplateInput().prop('value')).toEqual(
      advancedTemplateInputValue
    );

    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(1)
      .simulate('click');

    expect(wrapper.find('.pf-c-wizard__nav-link.pf-m-current').text()).toEqual(
      'Target Hosts'
    );
    wrapper
      .find('.pf-c-wizard__nav-link')
      .at(2)
      .simulate('click'); // Advanced step

    expect(effectiveUserInput().prop('value')).toEqual(effectiveUesrValue);
    expect(advancedTemplateInput().prop('value')).toEqual(
      advancedTemplateInputValue
    );
  });
  it('fill template fields', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Advanced Fields'));
    });
    const searchValue = 'search test';
    const textValue = 'I am a text';
    const dateValue = '08/07/2021';
    const textField = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    const selectField = screen.getByText('option 1');
    const searchField = screen.getByPlaceholderText('Filter...');
    const dateField = screen.getByLabelText('adv date', {
      selector: 'input',
    });

    fireEvent.click(selectField);
    await act(async () => {
      await fireEvent.click(screen.getByText('option 2'));
      fireEvent.click(screen.getAllByText('Advanced Fields')[0]); // to remove focus
      await fireEvent.change(textField, {
        target: { value: textValue },
      });

      await fireEvent.change(searchField, {
        target: { value: searchValue },
      });
      await fireEvent.change(dateField, {
        target: { value: dateValue },
      });
    });
    expect(
      screen.getByLabelText('adv plain hidden', {
        selector: 'textarea',
      }).value
    ).toBe(textValue);
    expect(searchField.value).toBe(searchValue);
    expect(dateField.value).toBe(dateValue);
    await act(async () => {
      fireEvent.click(screen.getByText('Category and Template'));
    });
    expect(screen.getAllByText('Category and Template')).toHaveLength(3);

    await act(async () => {
      fireEvent.click(screen.getByText('Advanced Fields'));
    });
    expect(textField.value).toBe(textValue);
    expect(searchField.value).toBe(searchValue);
    expect(dateField.value).toBe(dateValue);
    expect(screen.queryAllByText('option 1')).toHaveLength(0);
    expect(screen.queryAllByText('option 2')).toHaveLength(1);
  });
});
