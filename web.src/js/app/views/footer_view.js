;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;
	
	var FooterView = appApi.views.BaseView.extend({
		events : {
			'click button.add' : 'onAdd'
		},

		tagName : 'div',

		className : 'footer_bar',

		initialize : function() {
			this.$el.empty();
			_.bindAll(this);
		},

		render : function() {
			var tmpl = _.template($('#tmpl_footer_bar').html());
			this.$el.html(tmpl());
			this.delegateEvents();
			return this.$el;
		},

		onAdd : function(e) {
			e.preventDefault();
			this.navigateTo('!/contacts/add');
			return false;
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.FooterView', FooterView);
}(window, document));
