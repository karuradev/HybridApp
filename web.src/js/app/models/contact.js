;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	/*
	 * Public APIs
	 */
	var Contact = Backbone.Model.extend({
		defaults : function() {
			return {
				index: 0,
				id : 0,
				rawId : 0,
				name : {
					givenName : null,
					familyName : null,
					formatted : null
				},
				avatar : 'img/avatar.png',
				photos : [],
				emails : [],
				phoneNumbers : [],
				note : ''
			};
		},

		initialize : function(options) {
			debug.info('[Model.contact] inside initialize');

			/*
			 * hook the change event
			 */
			this.on('change', function(model) {
				debug.info('[Models.Contact] onChange was triggered');

				this.cleanUp();

				var app = globals.app;
				var contacts = app.karura.Contacts();
				var notification = app.karura.Notification();

				contacts.saveContact(JSON.stringify(model), {
					progress : function(data, globals) {
						debug.info('[Models.Contact] saveContact:onProgress() ' + JSON.stringify(data));
					},

					reject : function(data, globals) {
						debug.error('[Models.Contact] saveContact:onReject() ' + JSON.stringify(data));
					},

					resolve : function(data, globals) {
						debug.info('[Models.Contact] saveContact:onResolve() ' + JSON.stringify(data));

						notification.showToast('Contact was successfully saved.');

						app.navigate('', {
							trigger : true,
							replace : true
						});
					}
				});

				debug.info('saveContact(): ' + JSON.stringify(model));
			}, this);
		},

		cleanUp : function() {
			// clean up previously set keys/values
			var action = this.get('action');

			if (action === 'add') {
				this.unset('id', { silent : true });
				this.unset('rawId', { silent : true });
			}

			this.unset('action', { silent : true });
			this.unset('label', { silent : true });
		}
	});

	/*
	 * Mark the object as final
	 */
	(Object.freeze||Object)(Contact.prototype);

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.models.Contact', Contact);
}(window, document));
