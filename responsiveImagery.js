/* 
					ReponsiveImagery.js v0.2

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                    Version 2, December 2004 

 Copyright (C) 2012 Rich Middleditch <@middric>

 Everyone is permitted to copy and distribute verbatim or modified 
 copies of this license document, and changing it is allowed as long 
 as the name is changed. 

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. You just DO WHAT THE FUCK YOU WANT TO. 
*/

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
					var1 = 0, var2 = 0,
					image, url, pattern;

				if (!src) {
					return;
				}
				pattern = methods.validateSrc(src);
				if (!pattern) {
					return;
				}

				params.placeholder.addClass(type);
				var1 = parseInt($('.var1', params.placeholder).css('z-index'), 10) || 0;
				var2 = parseInt($('.var2', params.placeholder).css('z-index'), 10) || 0;
				params.placeholder.removeClass(type);

				var matches = src.match(pattern.regex);
				if (pattern.var1 && matches[pattern.var1]) {
					matches[pattern.var1] = var1;
				}
				if (pattern.var2 && matches[pattern.var2]) {
					matches[pattern.var2] = var2;
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