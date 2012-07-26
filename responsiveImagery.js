/*
                    ReponsiveImagery.js v0.4

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
    'use strict';
    var params = { _evaluating: false },
        methods = {
            generatePlaceholder: function () {
                return params.placeholder || $('<div id="' + params.id + '" class="placeholder"><div class="var1"></div><div class="var2"></div></div>').appendTo('body');
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
                var type = el.attr('data-type') || false,
                    src = el.attr('data-src') || false,
                    alt = el.attr('data-alt') || '',
                    variables = [],
                    i, image, j, matches, pattern, url;

                if (!src) {
                    return;
                }
                pattern = methods.validateSrc(src);
                if (!pattern || !pattern.regex || !pattern.variables) {
                    return;
                }

                params.placeholder.addClass(type);
                variables[0] = parseInt($('.var1', params.placeholder).css('z-index'), 10) || 0;
                variables[1] = parseInt($('.var2', params.placeholder).css('z-index'), 10) || 0;
                params.placeholder.removeClass(type);

                matches = src.match(pattern.regex);
                for (i = 0, j = 0; i < variables.length; i++, j++) {
                    matches[pattern.variables[i]] = variables[j];
                }

                matches.shift();
                url = matches.join('');

                image = $('img', el);
                if (image.length) {
                    image.attr('src', url);
                } else {
                    $('<img src="' + url + '" alt="' + alt + '" />').appendTo(el);
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

    $.fn.responsiveImagery = function (options) {
        var self = this;

        params = $.extend({
            patterns: [],
            id: Math.random().toString(36).substr(2, 5),
            events: 'resize'
        }, options);

        params.placeholder = methods.generatePlaceholder();

        $(window).bind(params.events, function () {
            methods.evaluate(self);
        });
        methods.evaluate(this);
    };
}(jQuery));