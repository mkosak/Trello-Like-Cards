(function($) {

    "use strict";

    var events = function() {

    };

    // Primary events - ie. all click events under the "main" section
    events.primary = function() {

    	var event = $(this).attr('data-event') || 'click';

        // Show alert message
    	if(event == "alert") {
            app.utils.showAlert();
    	}

        if(event == "add-card") {
            app.card.add();
        }
    };

    // Primary events
    events.init = function() {

        // Don't follow any links unless they're supposed to open
        // in a new window. This is only the case for links
        // which are not related to the site such as the footer
        // navigation
        $(document).on('click', 'a', function(e) {
            if (e.currentTarget.target != '_blank') {
                e.preventDefault();
            }
            else {
                Tracker.trackOffsiteLink(this.href);
            }
        });

        // Set handler for all click events
		app.page.on('click', 'a, button', events.primary);

        // Edit card information events
        app.page.on('focus', 'input[name=card-label], textarea[name=card-desc]', function() {
            $(this).closest('.panel-body').toggleClass('editing');
            $(this).val('');
        });
        app.page.on('blur', 'input[name=card-label], textarea[name=card-desc]', function() {
            if($(this).val() == '') {
                if($(this).attr('name') == 'card-label') {
                    $(this).val('Add card name');
                }
                if($(this).attr('name') == 'card-desc') {
                    $(this).val('Add card description');
                }
            }

            // change card desctiption
            app.card.edit($(this), $(this).attr('name'));
            $(this).closest('.panel-body').toggleClass('editing');
        });

        // Remove card
        app.page.on('click', '.delete', function() {
            app.card.remove($(this));
        });
    };

    app.events = events;

})(jQuery);
