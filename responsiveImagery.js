(function ($) {
	var params = { _evaluating: false },
		methods = {
			generatePlaceholder: function () {
				return $('<div id="' + params.id + '" class="placeholder"><div class="width"></div><div class="height"></div></div>').appendTo('body');
			},
			evaluate: function (self) {
				if (!params._evaluating) {
					params._evaluating = true;
					self.each(function () {
						methods.render($(this));
					});
					params._evaluating = false;
				}
			},
			render: function (el) {
				var type = el.attr('data-ip-type') || false,
					src = el.attr('data-ip-src') || false,
					w = 0, h = 0,
					image, url, pattern;

				if (!src) {
					return;
				}
				pattern = methods.validateSrc(src);
				if (!pattern) {
					return;
				}

				params.placeholder.addClass(type);
				w = parseInt($('.width', params.placeholder).css('z-index'), 10) || 0;
				h = parseInt($('.height', params.placeholder).css('z-index'), 10) || 0;
				params.placeholder.removeClass(type);

				var matches = src.match(pattern.regex);
				if (pattern.w && matches[pattern.w]) {
					matches[pattern.w] = w;
				}
				if (pattern.h && matches[pattern.h]) {
					matches[pattern.h] = h;
				}
				matches.shift();
				url = matches.join('');

				image = $('img', el);
				if (image.length) {
					image.attr('src', url);
				} else {
					$('<img src="' + url + '" />').appendTo(el);
				}
			},
			validateSrc: function (src) {
				var pattern, i = 0;
				for (pattern in params.patterns) {
					if (params.patterns.hasOwnProperty(pattern)) {
						if (!!src.match(params.patterns[pattern].regex)) {
							return params.patterns[i];
						}
						i++;
					}
				}

				return false;
			}
		};

	$.fn.responsive = function (options) {
		var self = this;

		params = $.extend({
			patterns: [],
			id: Math.random().toString(36).substr(2, 5),
			events: 'resize'
		}, options);

		params.placeholder = params.placeholder || methods.generatePlaceholder();

		$(window).bind(params.events, function () {
			methods.evaluate(self);
		});
		methods.evaluate(this);
	};
}(jQuery));