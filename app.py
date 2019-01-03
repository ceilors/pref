from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, Flask, session
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.exceptions import abort

from user import users
from game import games

app = Flask(__name__)
app.register_blueprint(users, url_prefix='/user')
app.register_blueprint(games, url_prefix='/game')

@app.before_request
def load_logged_in_user():
    """If a user id is stored in the session, load the user object from
    the database into ``g.user``."""
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = { 'id': 0 }
        #g.user = User.query.filter_by(id=user_id).first()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup')
def signup():
    pass

@app.route('/login')
def login():
    pass

@app.route('/logout')
def logout():
    pass