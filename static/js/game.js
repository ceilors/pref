Game = function() {
    var self = this;

    this.games = {
        current: [],
        pending: []
    };

    var load_data = function(url) {
        var data = {};

        $.get(url).done(function(d) {
            data = JSON.parse(d);
        });
        return data;
    }

    this.set = function(param, url) {
        var data = load_data(url);
        switch (param) {
            case 'current':
                this.games.current = data;
                break;
            case 'pending':
                this.games.pending = data;
                break;
            default:
                break;
        }
    };
};

_Game = new Game();
