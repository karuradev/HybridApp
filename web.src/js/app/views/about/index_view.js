;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var IndexView = appApi.views.BaseView.extend({
		tagName : 'div',

		className : 'view about',

		initialize : function(options) {
			debug.info('[Views.About.IndexView] inside initialize');

			appApi.views.BaseView.prototype.initialize.call(this, options);

			this.$layout = options.$layout;
			this.hideFooter(true);

			this.TitleSubview = new appApi.views.About.TitleSubview({});
			this.CopyrightSubview = new appApi.views.About.CopyrightSubview({});

			this.$el.empty();
			_.bindAll(this);
		},

		render : function() {
			debug.info('[Views.About.IndexView] inside render');

			var tmpl = _.template($('#tmpl_about_index').html());
			this.el.innerHTML = tmpl();

			this.subView({
				'.title' : this.TitleSubview,
				'.copyright' : this.CopyrightSubview
			});

			this.scrollView(this.el);

			return this.$el;
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.About.IndexView', IndexView);
}(window, document));
