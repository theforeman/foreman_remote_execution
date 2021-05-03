function update_foreign_input_set_include(include_all_checkbox) {
    fieldset = $(include_all_checkbox.closest('fieldset'));
    fieldset.find('input.foreign_input_set_include').prop('disabled', include_all_checkbox.checked);
}
