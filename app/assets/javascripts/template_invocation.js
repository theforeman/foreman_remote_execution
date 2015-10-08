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

  $('input.trigger_mode_selector').on('click', function () {
     $("#trigger_mode_future").hide();
     $('#trigger_mode_' + $(this).val()).show();
   });

  $('select#job_invocation_job_name').on('change', refresh_execution_form);

  $('button#refresh_execution_form').on('click', refresh_execution_form);

  $('textarea#targeting_search_query').on('change', refresh_execution_form);

  $('select#targeting_bookmark_id').on('change', refresh_search_query);
}

function delayed_refresh(url, data){
  setTimeout(function () {
    $.ajax(
      {
        url: url,
        data: data,
        dataType: "script",
        error: function() { $("div.terminal div.printable").append(__('<div class="line error">There was an error while updating the status, try <a href="javascript:window.location.href=window.location.href">refreshing</a> the page</div>')) }
      }
    )
  }, 1000);
}

function job_invocation_refresh_data(){
  return {
    hosts_needs_refresh: $("div#hosts").data('refresh_required'),
    host_ids_needing_status_update: fetch_ids_of_hosts('status'),
    host_ids_needing_provider_update: fetch_ids_of_hosts('provider'),
    host_ids_needing_actions_update: fetch_ids_of_hosts('actions')
  }
}

function fetch_ids_of_hosts(attribute){
  return _.map($('div#hosts td.host_' + attribute + '[data-refresh_required="true"]'), function(elem) { return $(elem).data('id') });
}
