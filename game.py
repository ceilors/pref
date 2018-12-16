from flask import Blueprint
from auth import login_required

games = Blueprint('games', __name__, template_folder='templates')

@games.route('/new')
@login_required
def new(id):
    pass

@games.route('/pending')
def pending(id):
    pass

@games.route('/<int:id>/invite/<hash>')
@login_required
def invite(id, hash):
    pass

@games.route('/<int:id>/join')
@login_required
def join(id):
    pass

@games.route('/<int:id>/leave')
@login_required
def leave(id):
    pass

@games.route('/<int:id>/players')
@login_required
def players(id):
    pass

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
    pass

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
