;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var HeaderView = appApi.views.BaseView.extend({
		events : {
			'touchstart div.back' : 'onBack',
			'touchstart div.title' : 'onTitle',
			'touchstart div.about' : 'onAbout'
		},

		tagName : 'div',

		className : 'action_bar',

		initialize : function() {
			this.$el.empty();
			_.bindAll(this);
		},

		render : function() {
			var tmpl = _.template($('#tmpl_header_bar').html());

			this.$el.html(tmpl({
				title : globals.app.APP_NAME
			}));

			this.delegateEvents();

			return this.$el;
		},

		onBack : function(e) {
			e.preventDefault();
			var $back = $(e.currentTarget);
			$back.show().css({ visibility : 'visible' }).addClass('active');
			this.navigateTo('');
			return false;
		},

		onTitle : function(e) {
			e.preventDefault();
			this.navigateTo('');
			return false;
		},

		onAbout : function(e) {
			e.preventDefault();
			this.navigateTo('!/about/index');
			return false;
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.HeaderView', HeaderView);
}(window, document));
