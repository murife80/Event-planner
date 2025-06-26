from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from datetime import datetime

from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from models import db, User, Event, RSVP

# ────────────────────────────
# App & Extension Setup
# ────────────────────────────
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config["JWT_SECRET_KEY"] = "super-secret-key-change-me"

CORS(app, supports_credentials=True)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# ────────────────────────────
# Routes
# ────────────────────────────
@app.route("/")
def home():
    return {"message": "Event Planner API"}

# ---------- Public ----------
@app.route("/events", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify([e.to_dict() for e in events]), 200

# ---------- Protected (create event) ----------
@app.route("/events", methods=["POST"])
@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    data = request.get_json()

    title        = data.get("title")
    description  = data.get("description")
    location     = data.get("location")
    start_time   = data.get("start_time")
    end_time     = data.get("end_time")

    if not all([title, location, start_time, end_time]):
        return {"error": "Missing required fields"}, 400

    try:
        start_dt = datetime.fromisoformat(start_time)
        end_dt   = datetime.fromisoformat(end_time)
    except ValueError:
        return {"error": "Invalid date format"}, 400

    event = Event(
        title=title,
        description=description,
        location=location,
        start_time=start_dt,
        end_time=end_dt,
        host_id=user_id  # or created_by depending on your model
    )
    db.session.add(event)
    db.session.commit()
    return {"message": "Event created", "event": event.to_dict()}, 201

# ---------- Protected (RSVP) ----------
@app.route("/events/<int:event_id>/rsvp", methods=["POST"])
@jwt_required()
def rsvp_event(event_id):
    user_id = get_jwt_identity()

    if not Event.query.get(event_id):
        return {"error": "Event not found"}, 404
    if RSVP.query.filter_by(event_id=event_id, user_id=user_id).first():
        return {"error": "Already RSVPed"}, 409

    rsvp = RSVP(event_id=event_id, user_id=user_id)
    db.session.add(rsvp)
    db.session.commit()
    return {"message": "RSVP successful"}, 201

# ---------- Register ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username, email, password = data.get("username"), data.get("email"), data.get("password")

    if not username or not email or not password:
        return {"error": "Missing fields"}, 400
    if User.query.filter_by(email=email).first():
        return {"error": "User already exists"}, 409

    hashed_pw = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return {
        "message": "User registered",
        "user": {"id": user.id, "username": user.username},
        "access_token": token,
    }, 201

# ---------- Login ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return {"error": "Invalid credentials"}, 401

    token = create_access_token(identity=user.id)
    return {
        "message": "Login successful",
        "user": {"id": user.id, "username": user.username},
        "access_token": token,
    }, 200

# ────────────────────────────
# Run server
# ────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)
