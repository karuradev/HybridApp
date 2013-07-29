;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var DetailView = appApi.views.BaseView.extend({
		events : {
			'click div.edit' : 'onEdit'
		},

		tagName : 'li',

		initialize : function(options) {
			debug.info('[DetailView] inside initialize');

			appApi.views.BaseView.prototype.initialize.call(this, options);

			this.$layout = options.$layout;
			this.hideFooter(true);

			Object.defineProperties(this, {
				model : {
					get : function() {
						return options.model;
					}
				},
				collection : {
					get : function() {
						return options.collection;
					}
				}
			});

			this.$el.empty();

			_.bindAll(this);
		},

		render : function() {
			debug.info('[Views.Contacts.DetailView] inside render');

			var tmpl = _.template($('#tmpl_contacts_detail').html());

			this.el.innerHTML = tmpl(this.model.toJSON());
			this.scrollView(this.el);
		},

		onEdit : function(e) {
			debug.info('[Views.Contacts.DetailView] inside onEdit');

			e.preventDefault();

			var index = this.collection.indexOf(this.model);

			debug.info('[Views.Contacts.DetailView] edit index: ' + index);

			this.navigateTo('!/contacts/edit/' + index);

			return false;
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.Contacts.DetailView', DetailView);
}(window, document));
