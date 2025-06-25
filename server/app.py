from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash

from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from models import db, User, Event, RSVP

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

# 🔐 Session and CORS setup — insert THIS block here
app.secret_key = "super-secret"  # ⚠️ Replace with env variable in production
CORS(app, supports_credentials=True)

# ✅ DB and migration setup AFTER app + CORS
db.init_app(app)
migrate = Migrate(app, db)

# Routes
@app.route('/')
def home():
    return {"message": "Event Planner API"}

@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([event.to_dict() for event in events])

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return {"error": "Missing fields"}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "User already exists"}, 409

    hashed_pw = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=hashed_pw)

    db.session.add(user)
    db.session.commit()

    session['user_id'] = user.id
    return {
        "message": "User registered",
        "user": {"id": user.id, "username": user.username}
    }

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        session['user_id'] = user.id
        return {
            "message": "Login successful",
            "user": {"id": user.id, "username": user.username}
        }

    return {"error": "Invalid credentials"}, 401
