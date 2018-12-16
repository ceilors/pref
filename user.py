from flask import Blueprint
from auth import login_required

users = Blueprint('users', __name__, template_folder='templates')

@users.route('/<int:id>')
def profile(id):
    pass

@users.route('/<int:id>/stats')
def stats(id):
    pass

@users.route('/<int:id>/invites')
@login_required
def invites(id):
    pass