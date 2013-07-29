;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	/*
	 * Public APIs
	 */
	var Contacts = Backbone.Collection.extend({

		/* model is the reference to the model class which will be instantiated for
		 * each object which is created for this collection automatically by backbone
		 */
		model : appApi.models.Contact,

		/*
		 * Constructor for the Contacts collection
		 */
		initialize : function(options) {
			options || ( options = {});

			Object.defineProperty(this, 'controller', options.controller);

			/*
			 * hook the remove event
			 */
			this.on('remove', function(model) {
				debug.info('[Collections.Contacts] remove called for contact with id : ' + model.get('id'));

				var app = globals.app;
				var contacts = app.karura.Contacts();
				var notification = app.karura.Notification();

				contacts.removeContact(model.get('id'), {
					progress : function(data, globals) {
						debug.info('[Collections.Contacts] removeContact:onProgress() ' + JSON.stringify(data));
					},

					reject : function(data, globals) {
						debug.warn('[Collections.Contacts] removeContact:onReject() ' + JSON.stringify(data));
					},

					resolve : function(data, globals) {
						debug.info('[Collections.Contacts] removeContact:onResolve() ' + JSON.stringify(data))

						notification.showToast('Contact was successfully removed.');

						app.navigate('', {
							trigger : true,
							replace : true
						});
					}
				});
			}, this);
		},

		/**
		 * We are overriding the fetch method for this collection, because we dont want
		 * to go to the web to retrieve content, rather we want to retrieve this content
		 * from the native plugin
		 */
		fetch : function(options) {
			var app = globals.app;
			var contacts = app.karura.Contacts();
			var notification = app.karura.Notification();

			var success = options.success;
			var self = this;

			notification.showToast('Fetching native contacts.');

			/*
			 * Make a call to the native plugin. 
			 * @see karura.js for details on ContactPlugin APIs 
			 */
			contacts.getContact('*', null, 0, 10, {
				progress : function(data, globals) {
					debug.info('[Controllers.Contacts] getContact:onProgress() ' + JSON.stringify(data));
				},

				reject : function(data, globals) {
					debug.warn('[Controllers.Contacts] getContact:onReject:() ' + JSON.stringify(data));
				},

				resolve : function(data, globals) {
					debug.info('[Controllers.Contacts] getContact:onResolve() ' + JSON.stringify(data));
					self.reset(data);

					if (success) {
						success(self, data, options);
					}
				}
			});
		},
	});

	/*
	 * Mark the object as final
	 */
	(Object.freeze||Object)(Contacts.prototype);

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.collections.Contacts', Contacts);
}(window, document));
