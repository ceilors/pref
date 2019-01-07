declare var Game: any; // variable from html template
interface String { format(...args: any[]): string; } // extend string prototype with format function

// if Game is undefined than user is not authorized
(() => {
    // format string function
    String.prototype.format = function(...args: any[]) {
        // cast String to string
        let result:string = this + '';
        // each arg is replacing '{i}' in string, where 'i' is arg's index
        for (let i:number = 0; i < args.length; i++) {
            let regex:RegExp = new RegExp('\\{' + i + '\\}', 'gi');
            result = result.replace(regex, args[i]);
        }
        return result;
    };

    // popup windows
    class popup {
        readonly overlay: JQuery; // overlay div for popup
        readonly window: JQuery; // popup window itself
        title: JQuery | string; // window title (set - string, get - jquery obj)
        content: JQuery | string; // window content (set - html-string, get - jquery obj)
        // buttons in window
        buttons: {
            node: JQuery;
            confirm(txt?: string, clk?: Function): JQuery;
            cancel(txt?: string, clk?: Function): JQuery;
            add(txt?: string, clk?: Function): JQuery;
            // custom buttons are stored like
            custom: JQuery[];
        };
        width: string | number = 0;

        append(html: string) { (<JQuery>this.content).append(html); return this; };
        prepend(html: string) { (<JQuery>this.content).prepend(html); return this; };
        form(property?: string, value?: string): JQuery | string {
            if (typeof property == 'string' && typeof value == 'undefined') {
                return (<JQuery>this.form()).attr(property);
            } else if (typeof property == 'string' && typeof value != 'undefined') {
                (<JQuery>this.form()).attr(property, value);
            }
            return <JQuery>$(this.window[0].querySelector('.popup-body > form'));
        };
        reset() {
            let self = this;
            this.content = ''; this.title = ''; this.form('action', '');
            this.buttons.confirm('Ok', function() { return false; }).show();
            this.buttons.cancel('Close', function() { self.hide(); return false; }).show();
            this.window.find('.button-custom').remove();
            delete this.buttons.custom;
            return this;
        };
        centerize() {
            let left = (window.innerWidth - this.window.outerWidth()) / 2;
            let top = (window.innerHeight - this.window.outerHeight()) / 2 + window.pageYOffset;
            left = left < 0 ? 10 : left;
            top = top < 0 ? 10 : top;
            this.window.css({ left: left, top: top });
            return this;
        };
        show(width?: string | number) {
            this.width = width || this.width || 450;
            (<JQuery>this.content).css({ width: this.width });
            this.overlay.stop().show().animate({ opacity: .5 }, 200);
            this.centerize().window.fadeIn(200);
            return this;
        };
        hide(callback?: Function) {
            this.overlay.stop().animate({ opacity: 0 }, function() { $(this).hide(); });
            this.window.fadeOut(150, function() {
                if (typeof callback == 'function') { callback(); }
                else { (function() { return false; })(); }
            });
            return this;
        };
        submit(callback?: Function, failback?: Function) {
            (<JQuery>this.form()).submit(function(e) { e.preventDefault(); return false; })
            var form = <JQuery>this.form();
            var fd = new FormData(<HTMLFormElement>form[0]);
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                contentType: form.attr('enctype'),
                processData: false,
                data: fd
            }).done(function(data, st, jqxhr) { if (typeof callback == 'function') { callback(data, st, jqxhr); } })
              .fail(function(jqxhr, st, err) { if (typeof failback == 'function') { failback(jqxhr, st, err); } });
        };

        constructor() {
            let self = this;
            let id: number = document.querySelectorAll('.popup').length;
            this.overlay = $('<div class="popup-overlay" for="popup-{0}"></div>'.format(id));
            this.window = $('<div class="popup-window" id="popup-{0}"></div>'.format(id));
            $(document.body).append(this.overlay).append(this.window);

            this.window[0].innerHTML =
                '<div class="popup-header">&nbsp;<span class="popup-title"></span>' +
                '<div class="popup-actions"><a href="#" class="popup-close"><i class="fas fa-times"></i></a></div>' +
                '</div><div class="popup-body"><form action="" method="post" enctype="multipart/form-data">' +
                '<div class="popup-content"></div><div class="popup-buttons">' +
                '<button type="submit" class="popup-button confirm">Ok</button>' +
                '<button type="cancel" class="popup-button cancel">Close</button></div></form></div>';

            this.window.find('.popup-close, .popup-button.cancel').click(function(e) { self.hide(); return false; });
            this.window.data('popup', this).css({ display: 'none' });

            Object.defineProperties(this, {
                'title': {
                    'get': function() { return $(this.window[0].querySelector('.popup-title')); },
                    'set': function(text: string) { this.title[0].innerText = text; }
                },
                'content': {
                    'get': function() { return $(this.window[0].querySelector('.popup-content')); },
                    'set': function(text: string) { this.content.html(text); }
                }
            });

            this.buttons = {
                custom: [],
                node: <JQuery>$(self.window[0].querySelector('.popup-buttons')),
                confirm: function(text?: string | Function, onclick?: Function) {
                    if (typeof text == 'string') { this.confirm().html(text); }
                    else if (typeof text == 'function') {
                        this.confirm().off('click')
                                      .on('click', (e: JQueryEventObject) => text);
                    }
                    if (typeof onclick == 'function') {
                        this.confirm().off('click')
                                      .on('click', (e: JQueryEventObject) => onclick);
                    }
                    return <JQuery>$(this.node.children('.confirm'));
                },
                cancel: function(text?: string | Function, onclick?: Function) {
                    if (typeof text == 'string') { this.cancel().filter('.cancel').html(text); }
                    else if (typeof text == 'function') {
                        this.cancel().off('click')
                                     .on('click', (e: JQueryEventObject) => text);
                    }
                    if (typeof onclick == 'function') {
                        this.cancel().off('click')
                                     .on('click', (e: JQueryEventObject) => onclick);
                    }
                    return <JQuery>this.node.children('.cancel')
                        .add(self.window[0].querySelector('.popup-close'));
                },
                add: function(text?: string, onclick?: Function) {
                    var next = this.node.children('.btn-custom').length;
                    var btn = $('<button class="popup-button btn-custom" id="btn-{1}">{0}</button>'.format(text, next));
                    this.node.prepend(btn);
                    btn.on('click', (e: JQueryEventObject) => onclick);
                    this.custom.push(btn);
                    return btn;
                }
            };
        }
    };

    angular.module('prefApp', [])
        .controller('prefController', ['$scope', '$log', function($scope, $log) {
            $scope.gameInit = function() {
                let loading = document.getElementById('loading');
                if (loading != null) loading.remove();

                if (typeof Game.User !== null) {
                    $log.debug('Game is initialized');
                } else {
                    $log.debug('Game is not initialized');
                    // show auth popup
                    let p = new popup();
                    p.title = 'Log in or sign up to continue';
                    p.append(`<div class="input-group">
                        <label>Username/E-mail</label>
                        <input type="text" name="username" /></div>`);
                        p.append(`<div class="input-group">
                        <label>Password</label>
                        <input type="password" name="password" /></div>`);
                    (<JQuery>p.content).css({ 'text-align': 'right' });
                    p.form('action', )
                    p.buttons.confirm('Log in <i class="fas fa-sign-in-alt"></i>').addClass('blue');
                    p.buttons.cancel('Sign up <i class="fas fa-user-plus"></i>').addClass('red')
                        .filter('.popup-close').remove();
                    p.show(400);
                }
            }
        }
    ]);
})();
