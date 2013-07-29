;(function(window, document, undefined){
	'use strict';
	
	function BrowserHelper() {
		var debug = window.debug;

		debug.info('[BrowserHelper] inside constructor');

		if (!(this instanceof BrowserHelper)) {
			return new BrowserHelper();
		}

		Object.defineProperties(this, {
			'hasTouch' : {
				get : function() {
					return !!('ontouchstart' in window);
				}
			},
		 	'onTouchCancel' : {
				get : function() {
					return (window.ontouchcancel !== undefined ? 'touchcancel' : 'mouseup');
				}
			},
			'onTouchStart' : {
				get : function() {
					return (window.ontouchstart !== undefined ? 'touchstart' : 'mousedown');
				}
			},
			'onTouchMove' : {
				get : function() {
					return (window.ontouchmove !== undefined ? 'touchmove' : 'mousemove');
				}
			},
			'onTouchEnd' : {
				get : function() {
					return (window.ontouchend !== undefined ? 'touchend' : 'mouseup');
				}
			},
			'onOrientationChange' : {
				get : function() {
					return 'orientationchange';
				}
			},
			'onResize' : {
				get : function() {
					return 'resize';
				}
			}
		});
		return this;
	}
	
	BrowserHelper.prototype = {
		constructor : BrowserHelper,

		VERSION : '1.0',

		ignoreMoveEvents : function() {
			debug.info('[BrowserHelper] ignoreMoveEvents called');

			var self = this;
			$(document).bind(self.onTouchMove, function(e) {
				e.preventDefault();
			});
		},

		startOrientationChangeListener : function() {
			debug.info('[BrowserHelper] startOrientationChangeListener called');
			// TODO: onResize is also called when orientation called

			var self = this;
			$(window).bind(self.onOrientationChange, function() {
				debug.info('[BrowserHelper] onOrientationChange called');
				var orientation = window.orientation;
				switch (orientation) {
					case 0:
						debug.log('[BrowserHelper] portrait (normal): ' + orientation);
						break;
					case 180:
						debug.log('[BrowserHelper] portrait (upside-down): ' + orientation);
						break;
					case -90:
						debug.log('[BrowserHelper] landscape (clockwise): ' + orientation);
						break;
					case 90:
						debug.log('[BrowserHelper] landscape (counter-clockwise): ' + orientation);
						break;
					default:
						debug.error('[BrowserHelper] Unknown orientation: ' + orientation);
				}
			});
		},

		startWindowResizeListener : function() {
			debug.info('[BrowserHelper] startWindowResizeListener called');

			var self = this;
			var heightBefore = $('body').css('height');
			$(window).bind(self.onResize, function() {
				var heightAfter = $('body').css('height');
				debug.info('[BrowserHelper] onResize heightBefore: ' + heightBefore + ', heightAfter: ' + heightAfter);
			});
		},

		isNotOperaOrMozilla : function() {
			debug.info('[BrowserHelper] isNotOperaOrMozilla called');

			return /(?!.*?compatible|.*?webkit)^mozilla|opera/i.test(navigator.userAgent);
		},

		// http://snook.ca/archives/javascript/settimeout_solve_domcontentloaded
		setDOMReadyListener: function(onReadyFunc) {
			debug.info('[BrowserHelper] setDOMReadyListener called');

			if (this.isNotOperaOrMozilla()) {
				document.addEventListener('DOMContentLoaded', onReadyFunc, false);
			} else {
				// simply load this function, asynchronously
				window.setTimeout(onReadyFunc, 10);
			}
		}
	};

	var instance = null;
	var singleton = {
		getInstance : function() {
			if (instance == null) {
				instance = new BrowserHelper();
				instance.constructor = null;

				/*
				 * Make this class final
				 */
				(Object.freeze||Object)(BrowserHelper.prototype);
			}
			return instance;
		}
	};

	window.exports.add('BrowserHelper', singleton);
}(window, document));
