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
import { WIZARD_TITLES } from '../../../JobWizardConstants';

const store = testSetup(selectors, api);
mockApi(api);

jest.spyOn(selectors, 'selectEffectiveUser');

selectors.selectEffectiveUser.mockImplementation(
  () => jobTemplate.effective_user
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
      'Target hosts and inputs'
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
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
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
      fireEvent.click(screen.getAllByText(WIZARD_TITLES.advanced)[0]); // to remove focus
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
      fireEvent.click(screen.getByText(WIZARD_TITLES.categoryAndTemplate));
    });
    expect(screen.getAllByText(WIZARD_TITLES.categoryAndTemplate)).toHaveLength(
      3
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Advanced Fields'));
    });
    expect(textField.value).toBe(textValue);
    expect(searchField.value).toBe(searchValue);
    expect(dateField.value).toBe(dateValue);
    expect(screen.queryAllByText('option 1')).toHaveLength(0);
    expect(screen.queryAllByText('option 2')).toHaveLength(1);
  });
  it('fill defaults into fields', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Advanced Fields'));
    });

    expect(
      screen.getByLabelText('effective user', {
        selector: 'input',
      }).value
    ).toBe('default effective user');
    expect(
      screen.getByLabelText('timeout to kill', {
        selector: 'input',
      }).value
    ).toBe('2');

    expect(
      screen.getByLabelText('description preview', {
        selector: 'input',
      }).value
    ).toBe(
      'template1 with inputs adv plain hidden="Default val" adv plain select="" adv search="" adv date="" plain hidden="Default val"'
    );
  });
  it('DescriptionField', async () => {
    render(
      <Provider store={store}>
        <JobWizard />
      </Provider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText(WIZARD_TITLES.advanced));
    });

    const textField = screen.getByLabelText('adv plain hidden', {
      selector: 'textarea',
    });
    await act(async () => {
      await fireEvent.change(textField, {
        target: { value: 'test command' },
      });
    });
    const descriptionValue = 'Run %{adv plain hidden} %{wrong command name}';

    await act(async () => {
      fireEvent.click(screen.getByText('Edit job description template'));
    });

    const editText = screen.getByLabelText('description edit', {
      selector: 'input',
    });
    await fireEvent.change(editText, {
      target: { value: descriptionValue },
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Preview job description'));
    });
    expect(
      screen.getByLabelText('description preview', {
        selector: 'input',
      }).value
    ).toBe('Run test command %{wrong command name}');
  });
});
