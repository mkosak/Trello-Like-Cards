(function($) {

    "use strict"

    /**
     * Global namespace for app
     *
     * @namespace
     */
    window.app = {

        /**
         * First function to run on page load
         */
        main: function(e) {

            // Page jquery object
            app.page = $('section.main .row-fluid');

            // Load data
            if(window.localStorage.getItem('cards')) {
                var cards = JSON.parse(app.utils.getData('cards'));

                cards.forEach(function(el, i) {
                    app.loadCards(cards[i].id, cards[i].name, cards[i].desc);
                });

                $('.panel').not(':first').removeClass('placeholder');
            }

            app.events.init();

            // Hide the loader once load complete
            app.utils.pageLoad(false);
        },

        loadCards: function(id, name, desc) {

            var cardTpl = $('.panel').eq(0).clone();

            cardTpl.attr('data-id', id);
            cardTpl.find('.card-label').val(name);
            cardTpl.find('.card-desc').val(desc);

            app.page.append(cardTpl[0]);
        }
    };

    $(window).on('load', app.main);

})(jQuery);

/**
 * jQuery selections
 *
 * @typedef {Array} jQuery
 */