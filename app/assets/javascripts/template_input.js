$(document).on('change', 'select.input_type_selector', function () {
  update_visibility_after_input_type_change($(this));
});

function update_visibility_after_input_type_change(select){
  fieldset = select.closest('fieldset');
  fieldset.find('div.custom_input_type_fields').hide();
  fieldset.find('div.' + select.val() + '_input_type').show();
}

function update_foreign_input_set_include(include_all_checkbox) {
    fieldset = $(include_all_checkbox.closest('fieldset'));
    fieldset.find('input.foreign_input_set_include').prop('disabled', include_all_checkbox.checked);
}
