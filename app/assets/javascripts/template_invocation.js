$(function() { job_invocation_form_binds() });

function refresh_execution_form() {
  var form = $('form#job_invocation_form');
  var data = form.serializeArray();

  request = $.ajax({
    data: data,
    type: 'POST',
    url: form.attr('data-refresh-url'),
    dataType: 'script'
  });

  request.done(function () {
    password_caps_lock_hint();
    form.find('a[rel="popover-modal"]').popover({html: true});
    form.find('select').select2({allowClear: true});
    job_invocation_form_binds();
  });
}

function refresh_search_query(value){
  id = value.val;
  $('textarea#targeting_search_query').val($('span#bookmark_query_map span#bookmark-' + id).data('query'));
}

function job_invocation_form_binds() {
  $('input.job_template_selector').on('click', function () {
    parent_fieldset = $(this).closest('fieldset');
    $(parent_fieldset).find('fieldset.job_template_form').hide();
    $('#job_template_' + $(this).val()).show();
  });

  $('select#job_invocation_job_name').on('change', refresh_execution_form);

  $('button#refresh_execution_form').on('click', refresh_execution_form);

  $('textarea#targeting_search_query').on('change', refresh_execution_form);

  $('select#targeting_bookmark_id').on('change', refresh_search_query);
}
