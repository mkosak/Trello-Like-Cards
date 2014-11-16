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
