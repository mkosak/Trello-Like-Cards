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
 */;

(function($) {

    "use strict";

    /**
     * Utility functions
     *
     * @namespace
     */
    app.utils = {

        pageLoad: function(show) {

            var loader = $('#loader');

            /**
             * Fade in the loader
             */
            var loaderShow = function() {
                loader.addClass('active');
                loader.css('display', 'table').animate({
                    opacity: 1
                }, 1500, function() {
                    // console.log('loader is active');
                });
            };

            /**
             * Fade out the loader
             */
            var loaderHide = function() {
                loader.removeClass('active');

                loader.animate({
                    // Solve the Chrome opacity animation issue
                    // See https://www.youtube.com/watch?v=IBX3_Mu7j54
                    opacity: 0.01
                }, 1500, function() {
                    $(this).css('display', 'none');
                });
            };

            if (show) {
                $('body').addClass('page-load');
                loaderShow();
            }
            else {
                $('body').removeClass('page-load');

                // May depend on smth or maybe configured later
                window.setTimeout(function() {
                    loaderHide();
                }, 1000);
            }
        },

        /**
         * Save data to the localStorage
         *
         * @param {String}   name           data parameter name to save
         * @param {String}   param          parameter value to save
         */
        saveData: function(name, param) {
            //console.log('--------------  app.utils.saveData');

            var dataToStore = JSON.stringify(param);

            if(typeof(window.localStorage) !== "undefined") {
                window.localStorage.setItem(name, dataToStore);
            }
            else {
                app.utils.showAlert('danger', '<strong>localStorage</strong> is not supported by your browser');
            }
        },

        /**
         * Get data from the localStorage
         *
         * @param {String}   name           data parameter name to get
         */
        getData: function(name) {
            //console.log('--------------  app.utils.getData');

            if(typeof(window.localStorage) !== "undefined") {
                var localData = JSON.parse(window.localStorage.getItem(name));

                if(localData !== undefined) {
                    return localData;
                }
            }
            else {
                app.utils.showAlert('danger', '<strong>localStorage</strong> is not supported by your browser');
            }
        },

    	/**
         * Show alert message div
         *
         * @param {String}  type      the alert type (may be "success", "info", "warning" or "danger")
         * @param {String}  msg       the alert message text
         */
        showAlert: function(type, msg) {
            //console.log('--------------  app.utils.showAlert');

            app.page.jqElement = app.page.find('.alert');

            // Remove HTML including event listeners
            app.page.jqElement.remove();
            // Remove reference between object and jQuery
            app.page.jqElement = null;

        	if((type || msg) === undefined) {
        		var type = "danger",
        			msg  = "<strong>Oh snap!</strong> Something goes wrong.";
        	}

            app.page.jqElement = '<div class="alert alert-' + type + '" role="alert">' + msg + '</div>';
            app.page.prepend(app.page.jqElement);
        },

        /**
         * Replace image sources with a blank png to avoid memory
         * issues in iOS (not only)
         *
         * @param {JQuery}  element     The jQuery selection which is searched for images
         */
        unloadImages: function(element) {
            element.find('img').attr('src', '/images/blank.png');
        }
    };

})(jQuery);
;

(function($) {

    "use strict";

    var card = function() {

    };

    /**
     * Edit card description
     *
     * @param {Object}  obj            jquery object
     */
    card.edit = function(obj) {
		//console.log('--------------  card.editDesc');

    	if(obj.length > 0) {
    		var dataToStore = {
    			'id':   parseInt(obj.closest('.panel').attr('data-id')),
    			'name': obj.closest('.panel').find('input[name=card-label]').val(),
    			'desc': obj.closest('.panel').find('textarea[name=card-desc]').val()
    		};

    		obj.closest('.panel').removeClass('placeholder');

    		// Save card label
    		card.save(dataToStore, 'edit');
    	}
    };

    /**
     * Add new card
     *
     */
    card.add = function() {
		//console.log('--------------  card.add');

    	// Take the latest card id
    	var cardTpl = app.page.find('.panel:last').clone();

    	// Increase the card id and reset the title
		cardTpl[0].dataset['id'] = (cardTpl[0].dataset['id'] * 1) + 1;
    	cardTpl.find('.card-label').val('Add card name');
    	cardTpl.find('.card-desc').val('Add card description');
    	cardTpl.addClass('placeholder');

    	// Clone and add new card
    	app.page.append(cardTpl[0]);

    	var dataToStore = {
			'id':   parseInt(cardTpl[0].dataset['id']),
			'name': cardTpl.find('.card-label').val(),
			'desc': cardTpl.find('.card-desc').val()
		};

		// Save card label
		card.save(dataToStore, 'add');
    };

    /**
     * Save card
     *
     * name for the storage property is skipped, means always "cards" so far
     *
     * @param {Object}   data            data object to save
     * @param {String}   param           data object to save
     */
    card.save = function(data, param) {
		//console.log('--------------  card.save');
    	var	cards = JSON.parse(app.utils.getData('cards'));
    	if(!cards) {
    		cards = [];
    	}

		if(param == 'edit') {
			if(cards.length > 0) {
				// edite card
	            cards[data.id-1]['name'] = data['name'];
	            cards[data.id-1]['desc'] = data['desc'];
			}
			else {
				cards.push({
					'id': 1,
					'name': data['name'],
					'desc': data['desc']
				});
			}
    	}
    	else {
    		// Save new card
    		cards.push(data);
    	}

        cards = JSON.stringify(cards);

    	// Save data to localStorage
    	app.utils.saveData('cards', cards);
    };


    /**
     * Remove card
     *
     * name for the storage property is skipped, means always "cards" so far
     *
     * @param {Object}   obj            jquery object to remove
     * @param {String}   data           data object to remove
     */
    card.remove = function(obj, data) {
		//console.log('--------------  card.remove');

    	if(obj.closest('.panel') !== undefined) {
	        var idToRemove = parseInt(obj.closest('.panel').attr('data-id'));
	    	var cards = JSON.parse(app.utils.getData('cards'));

		   	for (var i in cards) {
	            if(cards[i]['id'] == idToRemove) {
	            	cards.splice(i, 1);
	            }
	        }

	        // Remove HTML including event listeners
	        obj.closest('.panel').remove();

	    	cards = JSON.stringify(cards);

	    	// Save data to localStorage
	    	app.utils.saveData('cards', cards);
    	}
    };

    app.card = card;

})(jQuery);
;

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
