from flask import Blueprint, jsonify
from auth import login_required

games = Blueprint('games', __name__, template_folder='templates')

class Game:
    last_id = 0
    storage = {}
    def __init__(self, private=False):
        Game.last_id += 1
        self.id = Game.last_id
        self.status = 'pending'
        self.players = []
        self.state = {}
        self.private = private
        Game.storage[self.id] = self


@games.route('/new')
@login_required
def new():
    return jsonify(Game().__dict__)

@games.route('/pending')
def pending(id):
    games_pending = {k: v.__dict__ for k, v in Game.storage.items()
                                if v.status == 'pending'}
    return jsonify(games_pending)

@games.route('/current')
@login_required
def current(id):
    games_current = {k: v.__dict__ for k, v in Game.storage.items()
                                if v.status == 'current'}
    return jsonify(games_current)

@games.route('/<int:id>/invite/<int:user_id>')
@login_required
def invite(id, user_id):
    pass

@games.route('/<int:id>/join')
@games.route('/<int:id>/join/<hash>')
@login_required
def join(id, hash = None):
    pass


@games.route('/<int:id>/leave')
@login_required
def leave(id):
    pass

@games.route('/<int:id>/players')
@login_required
def players(id):
    return jsonify(Game.storage[id].players)

@games.route('/<int:id>/start')
@login_required
def start(id):
    pass

@games.route('/<int:id>/close')
@login_required
def close(id):
    pass

@games.route('/<int:id>/state')
@login_required
def state(id):
    return jsonify(Game.storage[id].state)

@games.route('/<int:id>/contract')
@login_required
def contract(id):
    pass

@games.route('/<int:id>/move')
@login_required
def move(id):
    pass

@games.route('/<int:id>/finish')
@login_required
def finish(id):
    pass
