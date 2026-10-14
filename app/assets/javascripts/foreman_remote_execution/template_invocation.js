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
