$(document).on('click', '.interface_execution', function () {
    confirm_flag_change(this, '.interface_execution', __("Another interface is already set as execution. Are you sure you want to use this one instead?"));

    var modal_form = $('#interfaceModal').find('.modal-body').contents();
    $('#interfaceForms .interface_execution:checked').attr("checked", false);
});
