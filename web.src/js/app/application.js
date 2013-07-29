;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var controllerCache = {};

	/*
	 * Public APIs
	 */
	var Application = Backbone.Router.extend({

		initialize : function(options) {
			//nothing to be done in this case
			if (options === null) {
				throw new Error('Application view not specified.');
			}

			debug.info('[Application] Inside constructor');

			// The jquery representation of the container view was 
			// passed in from index.html
			var $view = options.view;

			// locate the header, main content and footer elements
			var $header = $view.find('header');
			var $section = $view.find('section');
			var $footer = $view.find('footer');

			/*
			 * Getters/Setters
			 */
			Object.defineProperties(this, {
				karura : {
					get : function() {
						return options.karura;
					}
				},

				APP_NAME : {
					get : function() {
						return 'Hybrid Contacts';
					}
				},

				CONTACT_FIELDS : {
					get : function() {
						return 'id,name,emails,phoneNumbers,photos,note';
					}
				},

				EMAIL_FIELDS : {
					get : function() {
						return 'home,work,other';
					}
				},

				PHONE_FIELDS : {
					get : function() {
						return 'mobile,work,home,main,work fax,home fax,pager,other';
					}
				},

				utils : {
					get : function() {
						return exports.Helper.getInstance();
					}
				},

				browser : {
					get : function() {
						return exports.BrowserHelper.getInstance();
					}
				},

				$header : {
					get : function() {
						return $header;
					}
				},

				$section : {
					get : function() {
						return $section;
					}
				},

				$footer : {
					get : function() {
						return $footer;
					}
				}
			});

			debug.info('[Application] constructor about to exit');
		},

		launch : function(controllerName, action, args) {
			var app = globals.app;
			var appApi = exports.app;

			debug.info('[Application] launch called [controller : ' + controllerName + ' , action: ' + action + ']');
			debug.info('[Application] fragment : ' + app.utils.getFragment());

			var controller;
			try {
				controller = controllerCache[controllerName];
				if (controller == null) {
					debug.info('[Application] allocating new controller');

					controller = new appApi.controllers[controllerName]();
					controllerCache[controllerName] = controller;
				}
				controller[action].apply(controller, args);
			} catch (e) {
				debug.error('[Application] Error stack: ' + e.stack);
			}
		},

		start : function() {
			this.utils.startHistory();
			this.utils.preloadCssImages();

			this.browser.ignoreMoveEvents();
			this.browser.startOrientationChangeListener();
			this.browser.startWindowResizeListener();

			var appApi = exports.app;

			var headerContentView = new appApi.views.HeaderView({});
			this.$header.html(headerContentView.render());

			var footerContentView = new appApi.views.FooterView({});
			this.$footer.html(footerContentView.render());
		},

		routes : {
			'' : 'contacts/index',
			'!/contacts' : 'contacts/index',
			'!/contacts/detail/:id' : 'contacts/detail',
			'!/contacts/edit/:id' : 'contacts/edit',
			'!/contacts/add' : 'contacts/add',
			'!/about/index' : 'about/index'
		},

		'contacts/index' : function() {
			this.launch('Contacts', 'index', arguments);
		},

		'contacts/detail' : function(id) {
			this.launch('Contacts', 'detail', arguments);
		},

		'contacts/edit' : function(id) {
			this.launch('Contacts', 'edit', arguments);
		},

		'contacts/add' : function() {
			this.launch('Contacts', 'add', arguments);
		},

		'about/index' : function() {
			this.launch('About', 'index', arguments);
		}
	});

	var instance = null;
	var singleton = {
		getInstance : function(options) {
			if (instance == null) {
				instance = new Application(options);
				instance.constructor = null;
			}
			return instance;
		}
	};

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.Application', singleton);
}(window, document));
