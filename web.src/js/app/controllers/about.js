;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	function About() {
		if (!(this instanceof About)) {
			return new About();
		}
		return this;
	};

	/*
	 * Public APIs
	 */
	About.prototype = {
		constructor : About,

		VERSION : '1.0',

		index : function() {
			var app = globals.app;

			var IndexView = new appApi.views.About.IndexView({
				$layout : app.$section,
				canGoBack : true
			});

			IndexView.render();
		},

		toString : function() {
			return '[Controllers.About]';
		}
	};

	/*
	 * Mark the object as final
	 */
	(Object.freeze||Object)(About.prototype);

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.controllers.About', About);
}(window, document));
