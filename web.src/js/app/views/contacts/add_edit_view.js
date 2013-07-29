;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var appApi = exports.app;

	var AddEditView = appApi.views.BaseView.extend({
		events : {
			'click input.negative' : 'onNegativeBtn',
			'click input.positive' : 'onPositiveBtn'
		},

		tagName : 'div',

		className : 'view add_edit',

		label : null,

		initialize : function(options) {
			debug.info('[AddEditView] inside initialize');

			appApi.views.BaseView.prototype.initialize.call(this, options);
			
			this.action = options.action;
			this.label = (options.action === 'edit') ? 'remove' : 'cancel';

			this.$layout = options.$layout;
			this.hideFooter(true);

			Object.defineProperties(this, {
				model : {
					get : function() {
						return options.model;
					}
				},
				collection : {
					get : function() {
						return options.collection;
					}
				}
			});

			this.$el.empty();

			_.bindAll(this);
		},

		render : function() {
			debug.info('[Views.Contacts.AddEditView] inside render');

			var tmpl = _.template($('#tmpl_contacts_add_edit').html());

			debug.info('[Views.Contacts.AddEditView] model: ' + JSON.stringify(this.model));

			this.model.set({
				action : this.action,
				label : this.label
			}, { silent : true });

			this.el.innerHTML = tmpl(this.model.toJSON());
			this.scrollView(this.el);
		},

		onNegativeBtn : function(e) {
			debug.info('[Views.Contacts.AddEditView] inside onNegativeBtn');

			e.preventDefault();

			if (this.label === 'remove') {
				this.collection.remove(this.model);
			} else if (this.label === 'cancel') {
				this.navigateTo('');
			}
		},

		onPositiveBtn : function(e) {
			debug.info('[Views.Contacts.AddEditView] inside onPositiveBtn');

			e.preventDefault();

			$(e.target).find('input').blur();

			var data = {};

			data['id'] = $(e.currentTarget).closest('form').data('id') || 0;

			data['name'] = {};
			data['name']['givenName'] = $('input[id=givenName]').val().trim();
			data['name']['familyName'] = $('input[id=familyName]').val().trim();

			data['emails'] = [];
			var $emails = $('input[type=email]');
			$emails.each(function(i, el) {
				var $el = $(el);
				var type = $('select[data-id="' + $el.data('id') + '"]').val();
				var value = $el.val().trim();
				var id = $el.data('id') || 0;
				if (value !== '') {
					data['emails'].push({
						type : type,
						id : id,
						value : value
					});
				}
			});

			data['phoneNumbers'] = [];
			var $phoneNumbers = $('input[type=tel]');
			$phoneNumbers.each(function(i, el) {
				var $el = $(el);
				var type = $('select[data-id="' + $el.data('id') + '"]').val();
				var value = $el.val().trim();
				var id = $el.data('id') || 0;
				if (value !== '') {
					data['phoneNumbers'].push({
						type : type,
						id : id,
						value : value
					});
				}
			});

			data['note'] = $('textarea[id=note]').val().trim();

			this.model.set(data);
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.Contacts.AddEditView', AddEditView);
}(window, document));
