function show_import_job_template_modal() {
  var modal_window = $('#importJobTemplateModal');
  modal_window.modal({'show': true});
  modal_window.find('a[rel="popover-modal"]').popover();
}

function close_import_job_template_modal() {
  var modal_window = $('#importJobTemplateModal');
  modal_window.modal('hide');
}
