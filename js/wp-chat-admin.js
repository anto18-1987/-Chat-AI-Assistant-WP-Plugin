jQuery(document).ready(function($) {
    // Toggle checkbox state when toggle button label is clicked
    $('.toggle-label').click(function(e) {
        e.preventDefault(); // Prevent default action
        var checkbox = $(this).find('input[type="checkbox"]');
        var isChecked = checkbox.prop('checked');
        checkbox.prop('checked', !isChecked).change(); // Toggle checkbox state and trigger change event
    });

    // Update toggle button state when checkbox state changes
    $('#chat_enabled').change(function() {
        var isChecked = $(this).is(':checked');
        var toggle = $(this).closest('.toggle-label').find('.toggle');
        if (isChecked) {
            toggle.addClass('active').removeClass('inactive');
        } else {
            toggle.addClass('inactive').removeClass('active');
        }
    });
});
