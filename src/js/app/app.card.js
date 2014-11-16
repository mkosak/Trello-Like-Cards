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
