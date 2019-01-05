"use strict";
// if Game is undefined than user is not authorized
(function () {
    // format string function
    String.prototype.format = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // cast String to string
        var result = this + '';
        // each arg is replacing '{i}' in string, where 'i' is arg's index
        for (var i = 0; i < args.length; i++) {
            var regex = new RegExp('\\{' + i + '\\}', 'gi');
            result = result.replace(regex, args[i]);
        }
        return result;
    };
    // popup windows
    var popup = /** @class */ (function () {
        function popup() {
            var self = this;
            var id = document.querySelectorAll('.popup').length;
            this.overlay = $('<div class="overlay" for="popup-{0}"></div>'.format(id));
            this.window = $('<div class="popup" id="popup-{0}"></div>'.format(id));
            $(document.body).append(this.overlay).append(this.window);
            this.window[0].innerHTML =
                '<div class="popup-header">&nbsp;<span class="popup-title"></span>' +
                    '<div class="popup-actions"><a href="#" class="popup-close"><i class="fas fa-times"></i></a></div>' +
                    '</div><div class="popup-body"><form action="" method="post" enctype="multipart/form-data">' +
                    '<div class="popup-content"></div><div class="popup-buttons">' +
                    '<input type="submit" value="Ok" class="popup-button confirm">' +
                    '<input type="button" value="Close" class="popup-button cancel"></div></form></div>';
            this.window.find('.popup-close, .popup-button.cancel').click(function (e) { self.hide(); return false; });
            this.window.data('popup', this);
            Object.defineProperties(this, {
                'title': {
                    'get': function () { return $(this.window[0].querySelector('.popup-title')); },
                    'set': function (text) { this.title[0].innerText = text; }
                },
                'content': {
                    'get': function () { return $(this.window[0].querySelector('.popup-content')); },
                    'set': function (text) { this.content.html(text); }
                }
            });
            this.buttons = {
                custom: [],
                node: $(self.window[0].querySelector('.popup-buttons')),
                confirm: function (text, onclick) {
                    if (typeof text == 'string') {
                        this.confirm().val(text);
                    }
                    else if (typeof text == 'function') {
                        this.confirm().off('click')
                            .on('click', function (e) { return text; });
                    }
                    if (typeof onclick == 'function') {
                        this.confirm().off('click')
                            .on('click', function (e) { return onclick; });
                    }
                    return $(this.node.children('.confirm'));
                },
                cancel: function (text, onclick) {
                    if (typeof text == 'string') {
                        this.cancel().filter('.cancel').val(text);
                    }
                    else if (typeof text == 'function') {
                        this.cancel().off('click')
                            .on('click', function (e) { return text; });
                    }
                    if (typeof onclick == 'function') {
                        this.cancel().off('click')
                            .on('click', function (e) { return onclick; });
                    }
                    return this.node.children('.confirm')
                        .add(self.window[0].querySelector('.popup-close'));
                },
                add: function (text, onclick) {
                    var next = this.node.children('.btn-custom').length;
                    var btn = $('<input type="button" value="{0}" '.format(text) +
                        'class="popup-button btn-custom" id="btn-{1}" />'.format(next));
                    this.node.prepend(btn);
                    btn.on('click', function (e) { return onclick; });
                    this.custom.push(btn);
                    return btn;
                }
            };
        }
        popup.prototype.append = function (html) { this.content.append(html); return this; };
        ;
        popup.prototype.prepend = function (html) { this.content.prepend(html); return this; };
        ;
        popup.prototype.form = function (property, value) {
            if (typeof property == 'string' && typeof value == 'undefined') {
                return this.form().attr(property);
            }
            else if (typeof property == 'string' && typeof value != 'undefined') {
                this.form().attr(property, value);
            }
            return $(this.window[0].querySelector('.popup-body > form'));
        };
        ;
        popup.prototype.reset = function () {
            var self = this;
            this.content = '';
            this.title = '';
            this.form('action', '');
            this.buttons.confirm('Ok', function () { return false; }).show();
            this.buttons.cancel('Close', function () { self.hide(); return false; }).show();
            this.window.find('.button-custom').remove();
            delete this.buttons.custom;
            return this;
        };
        ;
        popup.prototype.centerize = function () {
            var left = (window.innerWidth - this.window.outerWidth()) / 2;
            var top = (window.innerHeight - this.window.outerHeight()) / 2 + window.pageYOffset;
            left = left < 0 ? 10 : left;
            top = top < 0 ? 10 : top;
            this.window.css({ left: left, top: top });
            return this;
        };
        ;
        popup.prototype.show = function (width) {
            width = width || 600;
            this.content.css({ width: width });
            this.overlay.stop().show().animate({ opacity: .5 });
            this.centerize().window.show();
            return this;
        };
        ;
        popup.prototype.hide = function (callback) {
            this.overlay.stop().animate({ opacity: 0 }, function () { $(this).hide(); });
            this.window.fadeOut(150, function () {
                if (typeof callback == 'function') {
                    callback();
                }
                else {
                    (function () { return false; })();
                }
            });
            return this;
        };
        ;
        popup.prototype.submit = function (callback, failback) {
            this.form().submit(function (e) { e.preventDefault(); return false; });
            var form = this.form();
            var fd = new FormData(form[0]);
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                contentType: form.attr('enctype'),
                processData: false,
                data: fd
            }).done(function (data, st, jqxhr) { if (typeof callback == 'function') {
                callback(data, st, jqxhr);
            } })
                .fail(function (jqxhr, st, err) { if (typeof failback == 'function') {
                failback(jqxhr, st, err);
            } });
        };
        ;
        return popup;
    }());
    ;
    angular.module('prefApp', [])
        .controller('prefController', ['$scope', '$log', function ($scope, $log) {
            $scope.gameInit = function () {
                var loading = document.getElementById('loading');
                if (loading != null)
                    loading.remove();
                if (typeof Game === 'object') {
                    $log.debug('Game is initialized');
                }
                else {
                    $log.debug('Game is not initialized');
                    var d = new popup();
                    $log.debug(d);
                }
            };
        }
    ]);
})();
