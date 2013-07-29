;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var debug = window.debug;

	function Helper(options) {
		if (!(this instanceof Helper)) {
			return new Helper(options);
		}
		return this;
	}

	/*
	 * Public APIs
	 */
	Helper.prototype = {
		constructor : Helper,

		VERSION : '1.0',

		startTime : window.performance.timing.navigationStart,

		startHistory : function() {
			debug.info('[Helper] startHistory called');

			Backbone.history.start();
		},

		getFragment : function() {
			debug.info('[Helper] getFragment called');

			return Backbone.history.getFragment();
		},

		preloadCssImages : function() {
			debug.info('[Helper] preloadCssImages called');

			setTimeout(function() {
				$.preloadCssImages();
			}, 0);
		},

		getDevicePixelRatio : function() {
			if (window.devicePixelRatio === undefined) return 1;
			return window.devicePixelRatio;
		},

		drawablePath : function() {
			debug.log('[Helper] drawablePath called');

			var dpr = this.getDevicePixelRatio();

			if (dpr > 3) {
				return 'img/drawable-xxhdpi';
			} else if (dpr > 2) {
				return 'img/drawable-xhdpi';
			} else if (dpr > 1.5) {
				return 'img/drawable-hdpi';
			} else if (dpr > 1) {
				return 'img/drawable-mdpi';
			} else if (dpr > 0.75) {
				return 'img/drawable-ldpi';
			} else {
				return 'img';
			}
		},

		outerHTML : function($elm) {
			debug.info('[Helper] outerHTML called');

			$elm = ($elm.length) ? $elm[0] : $elm;

			var clone = $elm.cloneNode(true);
			var wrapper = document.createElement('div');
			wrapper.appendChild(clone);
			return wrapper.innerHTML;
		},

		loadImg : function(src) {
			debug.info('[Helper] loadImg called');

			var image = new Image();
			image.src = src;
			image.onerror = function() {
				debug.error('Error loading image source: ' + this.src);
			};
			return image;
		},

		toString : function() {
			return '[Helper]';
		}
	};

	var instance = null;
	var singleton = {
		getInstance : function() {
			if (instance == null) {
				instance = new Helper();
				instance.constructor = null;

				/*
				 * Make this class final
				 */
				(Object.freeze||Object)(Helper.prototype);
			}
			return instance;
		}
	};
	
	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('Helper', singleton);
}(window, document));
