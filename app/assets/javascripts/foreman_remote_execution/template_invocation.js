function delayed_refresh(url, data){
  setTimeout(function () {
    $.ajax(
      {
        url: url,
        data: data,
        dataType: "script",
        error: function() { $("div#job-invocation-chart").append('<div class="line error">' + __('There was an error while updating the status, try refreshing the page.') + '</div>'); }
      }
    )
  }, 1000);
}

function job_invocation_refresh_data(){
  return {
    hosts_needs_refresh: $("div#hosts").data('refresh_required'),
    host_ids_needing_name_update: fetch_ids_of_hosts('name'),
    host_ids_needing_status_update: fetch_ids_of_hosts('status'),
    host_ids_needing_actions_update: fetch_ids_of_hosts('actions')
  }
}

function fetch_ids_of_hosts(attribute){
  return $('div#hosts td.host_' + attribute + '[data-refresh_required="true"]').map(function() { return $(this).data('id') }).get();
}
