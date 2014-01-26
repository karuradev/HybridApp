;(function(window, document, undefined) {
	'use strict';

	var exports = window.exports;
	var globals = window.globals;
	var debug = window.debug;

	var BaseView = Backbone.View.extend({
		$focusedField : null,

		initialize : function(options) {
			debug.info('[BaseView] initialize called');

			this.showBackButton(options.canGoBack);
			return this;
		},

		render : function() {
			return this;
		},

		remove : function() {
			this.$el.unbind();
			this.$el.remove();
		},

		mainView : function(view) {
			var $mainView = this.$layout.empty().append(view);
			return $mainView;
		},

		subView : function(views) {
			_.each(views || {}, function(view, selector) {
				view.setElement(this.$(selector)).render();
			}, this);
		},

		emptyView : function(view) {
			this.$layout.removeClass().addClass('empty');
			this.mainView(view);
		},

		scrollView : function(view, options) {
			debug.info('[Views.BaseView] scrollView called');

			var timeout;
			var $touchable;
			var defaults = {
				hideScrollbar : true,
				lockDirection : true,
				handleClick : false,

				onBeforeScrollStart : function(e) {
					// debug.info('onBeforeScrollStart');
				},

				onScrollStart : function(e) {
					// debug.info('onScrollStart');
					timeout = setTimeout(function() {
						$touchable = $(e.srcElement).closest('.touchable');
						$touchable.addClass('active');
						timeout = null;
					}, 10);
				},

				onScrollMove : function(e) {
					// debug.info('onScrollMove');
					if (this.moved === true) {
						if (timeout) clearTimeout(timeout);
						$touchable.removeClass('active');
					}
				},

				onBeforeScrollEnd : function(e) {
					// debug.info('onBeforeScrollEnd');
					if (this.moved === false) {
						if (timeout) clearTimeout(timeout);
						$touchable.removeClass('active');
					}
				},

				onScrollEnd : function(e) {
					// debug.info('onScrollEnd');
				}
			};

			_.extend(defaults, options);

			var iscroll;
			var firstTime = true;
			var $mainView;
			var $wrapper = this.$layout.find('.wrapper');

			if ($wrapper.length) {
				var $list = $wrapper.find('.scroller .list');
				$list.empty().append(view);
				iscroll = $wrapper.data('iscroll');
				setTimeout(function() {
					iscroll.refresh();
					iscroll.scrollTo(0, 0, 300);
				}, 0);
				firstTime = false;
			}

			if (firstTime === true) {
				this.$layout.removeClass();
				$mainView = this.mainView('<div class="wrapper"><div class="scroller"><ul class="list"></ul></div></div>');
				$wrapper = $mainView.find('.wrapper');
				$wrapper.find('.scroller .list').append(view);

				iscroll = new iScroll($wrapper[0], defaults);
				$wrapper.data('iscroll', iscroll);
			}

			this.onOrientation(iscroll);
			this.onFocus($wrapper.find('.scroller .list'), iscroll);
		},

		onOrientation : function(iscroll) {
			if (iscroll !== undefined) {
				$(window).bind('orientationchange', function(e) {
					debug.info('[Views.BaseView] onOrientation called');
					setTimeout(function() {
						iscroll.refresh();
					}, 1000);
				});
			}
		},

		onFocus : function($view, iscroll) {
			if ($view.length && iscroll !== undefined) {
				$view.find('input, textarea').bind('focus', function(e) {
					debug.info('[Views.BaseView] onFocus called');
					var $focusedField = $(this)[0];
					$(window).bind('resize', function(e) {
						debug.info('[Views.BaseView] onResize called');
						debug.info(globals.app.utils.outerHTML($focusedField));
						setTimeout(function() {
							iscroll.refresh();
							iscroll.scrollToElement($focusedField, 200);
						}, 250);
					});
				});
			}
		},

		getPhoto : function(model, $view) {
			debug.info('[Views.BaseView] getPhoto called');

			var app = globals.app;
			var photos = model.get('photos');

			if (!_.isArray(photos) || photos.length === 0) {
				return;
			}

			var $avatar = $('img[data-id="' + model.get('id') + '"]', $view);
			var url = model.get('photos')[0].value;

			function update(src) {
				src = 'data:image/png;base64,' + src;
				model.set({
					avatar : src
				}, { silent : true });
				var image = app.utils.loadImg(src);
				image.onload = (function(src) {
					return function() {
						$avatar.attr('src', src);
					};
				})(src);
			}

			var contacts = app.karura.Contacts();

			contacts.getPhoto(url, {
				progress : function(data, globals) {
					debug.info('[Views.BaseView] getPhoto:onProgress() ' + JSON.stringify(data));
				},

				reject : function(data, globals) {
					debug.warn('[Views.BaseView] getPhoto:onReject() no photograph was retrieved for the user');
				},

				resolve : function(data, globals) {
					debug.info('[Views.BaseView] getPhoto:onResolve() ' + JSON.stringify(data));
					update(data);
				}
			});
		},

		navigateTo : function(fragment, options) {
			var app = globals.app;
			var defaults = {
				trigger : true,
				replace : false
			};
			_.extend(defaults, options);
			app.navigate(fragment, defaults);
		},

		forEach : function(obj, iterator, context) {
			if (obj === null) return;
			for (var i = 0, l = obj.length; i < l; i++) {
				if (iterator.call(context, obj.at(i), i, obj) === false) return;
			}
		},

		showBackButton : function(canGoBack) {
			var app = globals.app;
			var $back = app.$header.find('div.back');

			if (canGoBack === true) {
				$back.show().css({
					visibility : 'visible'
				});
			} else {
				$back.fadeOut(function() {
					$(this).show().css({
						visibility : 'hidden'
					}).removeClass('active');
				});
			}
		},

		hideLoading : function($layout) {
			debug.info('[BaseController] hideLoading called');
			$layout.empty().removeClass('loading');
		},

		hideFooter : function(hide) {
			var app = globals.app;
			app.$footer.toggle(!hide);
		}
	});

	/*
	 * Make this class accessible in the exports namespace
	 */
	exports.add('app.views.BaseView', BaseView);
}(window, document));
