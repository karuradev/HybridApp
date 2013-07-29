;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var EmptyView = appApi.views.BaseView.extend({

		initialize : function(options) {
			var app = globals.app;
			this.data = options.data;
			this.$layout = options.$layout;
			this.hideLoading(app.$section);
			this.$el.empty();
			_.bindAll(this);
		},

		render : function() {
			debug.info('[Views.EmptyView] inside render');

			var tmpl = _.template($('#tmpl_empty_view').html());

			this.el.innerHTML = tmpl(this.data);
			this.emptyView(this.el);

			return this.$el;
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.EmptyView', EmptyView);
}(window, document));
