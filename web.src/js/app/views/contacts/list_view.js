;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var ListView = appApi.views.BaseView.extend({

		initialize : function(options) {
			debug.info('[Views.Contacts.ListView] inside initialize');

			var app = globals.app;

			appApi.views.BaseView.prototype.initialize.call(this, options);

			Object.defineProperty(this, 'collection', {
				get : function() {
					return options.collection;
				}
			});

			this.$layout = options.$layout;
			this.$el.empty();

			this.hideFooter(false);
			this.hideLoading(app.$section);
			this.listenTo(this.collection, 'reset', this.render);

			this.listenTo(this.collection, 'add', function(model) {
				this.renderContact(model);
			});

			_.bindAll(this);
		},

		render : function() {
			debug.info('[Views.Contacts.ListView] inside render');

			this.forEach(this.collection, function(contact, index, list) {
				this.renderContact(contact, index);
			}, this);

			this.scrollView(this.el);

			return this.$el;
		},

		renderContact : function(model, index) {
			debug.info('[Views.Contacts.ListView] inside renderContact for index: ' + index);

			var view = this;
			var itemView = new appApi.views.Contacts.ItemView({
				model : model
			});

			itemView.render(function(el) {
				view.$el.append(el);
			});

			if (model.get('avatar').substr(0, 3) === 'img') {
				this.getPhoto(model, this.$el);
			}
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.Contacts.ListView', ListView);
}(window, document));
