function show_import_output_template_modal() {
  var modal_window = $('#importOutputTemplateModal');
  modal_window.modal({'show': true});
  modal_window.find('a[rel="popover-modal"]').popover();
}

function close_import_output_template_modal() {
  var modal_window = $('#importOutputTemplateModal');
  modal_window.modal('hide');
}
