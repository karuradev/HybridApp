;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var ItemView = appApi.views.BaseView.extend({
		events : {
			'click div.item' : 'onItem'
		},

		tagName : 'li',

		initialize : function(options) {
			debug.info('[Views.Contacts.ItemView] inside initialize');

			this.$el.empty();

			Object.defineProperty(this, 'model', {
				get : function() {
					return options.model;
				}
			});

			this.listenTo(this.model, 'change', this.render);

			_.bindAll(this);
		},

		render : function(callback) {
			debug.info('[Views.Contacts.ItemView] inside render for id ' + this.model.get('id'));

				var tmpl = _.template($('#tmpl_contacts_item').html());
				var modelJSON = this.model.toJSON();

				if (modelJSON.name === undefined || 
					((modelJSON.name.familyName === undefined || modelJSON.name.familyName === null) && 
					(modelJSON.name.givenName === undefined || modelJSON.name.givenName === null))) {
					modelJSON.name.givenName = "no name"
				}
				this.el.innerHTML = tmpl(modelJSON);

			this.delegateEvents();

			if (_.isFunction(callback)) {
				callback(this.el);
			}
		},

		onItem : function(e) {
			debug.info('[Views.Contacts.ItemView] inside onItem');

			e.preventDefault();

			var index = $(e.currentTarget).data('index');

			debug.info('[Views.Contacts.ItemView] detail index: ' + index);

			this.navigateTo('!/contacts/detail/' + index);

			return false;
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.Contacts.ItemView', ItemView);
}(window, document));
