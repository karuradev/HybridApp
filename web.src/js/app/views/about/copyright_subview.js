;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var CopyrightSubview = appApi.views.BaseView.extend({

		initialize : function() {
			this.$el.empty();
			_.bindAll(this);
		},

		render : function() {
			debug.info('[Views.About.CopyrightView] inside render');

			var tmpl = _.template($('#tmpl_about_copyright').html());
			this.$el.html(tmpl());

			return this.$el;
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.About.CopyrightSubview', CopyrightSubview);
}(window, document));
