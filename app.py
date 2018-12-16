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