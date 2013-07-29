;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	function Contacts() {
		if (!(this instanceof Contacts)) {
			return new Contacts();

		}
		return this;
	};

	/*
	 * Public APIs
	 */
	Contacts.prototype = {
		constructor : Contacts,

		VERSION : '1.0',

		/**
		 * This method is called when we navigate to index route
		 */
		index : function() {
			debug.info('[Controllers.Contacts] index');

			var self = this;
			var app = globals.app;

			function showContactList() {
				debug.info('[Controllers.Contact] index->showContactList');
				debug.info('[Controllers.Contact] collection => ' + self.collection);

				var ListView = new appApi.views.Contacts.ListView({
					$layout : app.$section,
					collection : self.collection
				});

				ListView.render();
			}

			function showEmptyNotice() {
				debug.info('[Controllers.Contact] index->showEmptyNotice');

				var EmptyView = new appApi.views.EmptyView({
					$layout : app.$section,
					data : {
						type : 'profile',
						msg : 'No contacts available'
					}
				});

				EmptyView.render();
			}

			function showContacts() {
				debug.info('[Controllers.Contact] index->showContacts');

				if (self.hasOwnProperty('collection')) {
					if (self.collection.length !== 0) {
						showContactList();
					} else {
						showEmptyNotice();
					}
					return true;
				}
				return false;
			}

			if (showContacts()) {
				return;
			}

			var collection = new appApi.collections.Contacts({
				controller : this
			});

			collection.fetch({
				success : function(model, data, options) {
					debug.info('[Collection.Contact] fetch was successful');

					//since we were able to load the collection successfully, lets make
					//it available else where in this controller
					Object.defineProperty(self, 'collection', {
						get : function() {
							return collection;
						}
					});

					//Try to render contacts
					showContacts();
				}
			});

		},

		/**
		 * The method to be called to initiate viewing a contact information
		 */
		detail : function(index) {
			debug.info('[Contacts.Detail] called for index: ' + index);

			var app = globals.app;
			var collection = this.collection;
			var model = collection.at(index);

			var DetailView = new appApi.views.Contacts.DetailView({
				$layout : app.$section,
				canGoBack : true,
				collection : collection,
				model : model
			});

			DetailView.render();
		},

		/**
		 * The method to be called to initiate adding a contact information
		 */
		add : function() {
			debug.info('[Controllers.Contacts] inside add');

			var app = globals.app;
			var model = new appApi.models.Contact();

			debug.info('[Controllers.Contacts] about to create a view');

			var AddEditView = new appApi.views.Contacts.AddEditView({
				$layout : app.$section,
				action : 'add',
				canGoBack : true,
				collection : this.collection,
				model : model
			});

			debug.info('[Controllers.Contacts] about to render add/edit view');

			AddEditView.render();
		},

		/**
		 * The method to be called to initiate editing a contact information
		 */
		edit : function(index) {
			debug.info('[Contacts.Edit] called for index: ' + index);

			var app = globals.app;
			var collection = this.collection;
			var model = collection.at(index);

			var AddEditView = new appApi.views.Contacts.AddEditView({
				$layout : app.$section,
				action : 'edit',
				canGoBack : true,
				collection : collection,
				model : model
			});

			AddEditView.render();
		},

		/**
		 * a toString implementation just in case you wish to use in some debug
		 * and logging statements
		 */
		toString : function() {
			return '[Controllers.Contacts]';
		}
	};

	/*
	 * Mark the object as final
	 */
	(Object.freeze||Object)(Contacts.prototype);

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.controllers.Contacts', Contacts);
}(window, document));
