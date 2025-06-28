# server/models.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash   # NEW

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)

    # NEW ─ store a salted+hashed password, never the plain text
    password_hash = db.Column(db.String(256), nullable=False)

    events = db.relationship('Event', backref='host', lazy=True)
    rsvps  = db.relationship('RSVP',  backref='user', lazy=True)

    
    # Password-helper methods

    def set_password(self, plaintext):
        """Hash the password and store it."""
        self.password_hash = generate_password_hash(plaintext)

    def check_password(self, plaintext):
        """Return True if the password matches the stored hash."""
        return check_password_hash(self.password_hash, plaintext)

class Event(db.Model):
    __tablename__ = 'events'

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String,  nullable=False)
    description = db.Column(db.Text)
    location    = db.Column(db.String,  nullable=False)
    start_time  = db.Column(db.DateTime, nullable=False)
    end_time    = db.Column(db.DateTime, nullable=False)
    created_by  = db.Column(db.Integer,  db.ForeignKey('users.id'))

    rsvps = db.relationship('RSVP', backref='event', lazy=True)

    def to_dict(self):
        return {
            "id":         self.id,
            "title":      self.title,
            "description":self.description,
            "location":   self.location,
            "start_time": self.start_time.isoformat(),
            "end_time":   self.end_time.isoformat(),
            "created_by": self.created_by,
            "host":       self.host.username if self.host else None,
        }

class RSVP(db.Model):
    __tablename__ = 'rsvps'

    id       = db.Column(db.Integer, primary_key=True)
    user_id  = db.Column(db.Integer, db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    message  = db.Column(db.String, nullable=False)
