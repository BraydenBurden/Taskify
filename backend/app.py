from flask import Flask, request, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta, datetime
import os
from dotenv import load_dotenv
import secrets
import random
import colorsys

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable debug mode
app.debug = True

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": [os.getenv('FRONTEND_URL', 'http://localhost:3000')],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///taskmanager.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
mail = Mail(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), unique=True)
    profile_picture = db.Column(db.Text, nullable=True)  # Store base64 encoded image
    tasks = db.relationship('Task', backref='user', lazy=True)
    bugs = db.relationship('Bug', backref='reporter', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'is_verified': self.is_verified,
            'profile_picture': self.profile_picture
        }

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subtasks = db.relationship('Subtask', backref='task', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id,
            'subtasks': [subtask.to_dict() for subtask in self.subtasks]
        }

# Subtask model
class Subtask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'task_id': self.task_id
        }

# Bug model
class Bug(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    steps = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), default='medium')  # low, medium, high
    status = db.Column(db.String(20), default='open')  # open, in_progress, resolved, closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'steps': self.steps,
            'severity': self.severity,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id,
            'user_name': self.reporter.name
        }

# Create database tables
with app.app_context():
    db.create_all()

def send_verification_email(user):
    try:
        token = secrets.token_urlsafe(32)
        user.verification_token = token
        db.session.commit()

        # Use frontend URL for verification
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        verification_url = f"{frontend_url}/verify-email/{token}"
        
        msg = Message('Welcome to Taskify - Verify Your Email',
                      sender=('Taskify Team', os.getenv('EMAIL_USER')),
                      recipients=[user.email])
        
        msg.body = f'''Hello {user.name},

Welcome to Taskify! To complete your registration and verify your email address, please click the link below:

{verification_url}

This link will expire in 24 hours. If you did not create a Taskify account, please ignore this email.

Best regards,
The Taskify Team
'''
        
        msg.html = f'''
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff9800;">Welcome to Taskify!</h2>
            <p>Hello {user.name},</p>
            <p>Thank you for signing up! To complete your registration and verify your email address, please click the button below:</p>
            <p style="text-align: center;">
                <a href="{verification_url}" style="background-color: #ff9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Verify Email Address</a>
            </p>
            <p style="color: #666; font-size: 0.9em;">This link will expire in 24 hours. If you did not create a Taskify account, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ffe0b2; margin: 20px 0;">
            <p style="color: #666; font-size: 0.8em;">Best regards,<br>The Taskify Team</p>
        </div>
        '''

        app.logger.info(f"Attempting to send verification email to {user.email}")
        mail.send(msg)
        app.logger.info(f"Successfully sent verification email to {user.email}")
        return True
    except Exception as e:
        app.logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        db.session.rollback()
        raise Exception(f"Failed to send verification email: {str(e)}")

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create new user
    new_user = User(
        email=data['email'],
        password=generate_password_hash(data['password']),
        name=data['name']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Send verification email
    send_verification_email(new_user)
    
    return jsonify({
        'message': 'User created successfully. Please check your email to verify your account.',
        'user': new_user.to_dict()
    }), 201

@app.route('/api/verify-email/<token>', methods=['GET'])
def verify_email(token):
    user = User.query.filter_by(verification_token=token).first()
    
    # If no user found with this token, check if any user was recently verified
    if not user:
        recently_verified = User.query.filter_by(is_verified=True, verification_token=None).order_by(User.id.desc()).first()
        if recently_verified:
            return jsonify({'message': 'Email verified successfully'}), 200
        return jsonify({'error': 'Invalid verification token'}), 400
    
    user.is_verified = True
    user.verification_token = None
    db.session.commit()
    
    return jsonify({'message': 'Email verified successfully'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_verified:
        return jsonify({'error': 'Please verify your email before logging in'}), 401
    
    if check_password_hash(user.password, data['password']):
        # Generate random color if user has no profile picture
        random_color = None
        if not user.profile_picture:
            # Generate bright, visually appealing colors
            hue = random.randint(0, 360)
            saturation = random.randint(60, 80)
            lightness = random.randint(45, 65)
            
            # Convert HSL to RGB then to Hex
            h = hue / 360
            s = saturation / 100
            l = lightness / 100
            
            rgb = colorsys.hls_to_rgb(h, l, s)
            random_color = '#{:02x}{:02x}{:02x}'.format(
                int(rgb[0] * 255),
                int(rgb[1] * 255),
                int(rgb[2] * 255)
            )
        
        access_token = create_access_token(identity=str(user.id))
        response_data = {
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token
        }
        
        if random_color:
            response_data['user']['random_color'] = random_color
            
        return jsonify(response_data), 200
    
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/resend-verification', methods=['POST'])
def resend_verification():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.is_verified:
        return jsonify({'error': 'Email is already verified'}), 400
    
    send_verification_email(user)
    
    return jsonify({'message': 'Verification email sent successfully'}), 200

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if user:
        return jsonify(user.to_dict()), 200
    
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/delete-user', methods=['POST'])
def delete_user():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/api/user', methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    try:
        data = request.get_json()
        app.logger.debug(f"Received data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if 'name' in data:
            user.name = data['name']
        
        if 'profile_picture' in data:
            # Validate that it's a base64 image
            if data['profile_picture']:
                if not isinstance(data['profile_picture'], str):
                    return jsonify({'error': 'Profile picture must be a string'}), 400
                if not data['profile_picture'].startswith('data:image/'):
                    return jsonify({'error': 'Invalid image format'}), 400
            user.profile_picture = data['profile_picture']
        
        db.session.commit()
        result = user.to_dict()
        app.logger.debug(f"Updated user: {result}")
        return jsonify({
            'message': 'Profile updated successfully',
            'user': result
        }), 200
    
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating user profile: {str(e)}")
        return jsonify({
            'error': 'Failed to update profile',
            'details': str(e)
        }), 500

# Task routes
@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = int(get_jwt_identity())
    tasks = Task.query.filter_by(user_id=current_user_id).order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@app.route('/api/tasks', methods=['POST'])
@jwt_required()
def create_task():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    new_task = Task(
        title=data['title'],
        description=data.get('description'),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
        priority=data.get('priority', 'medium'),
        status=data.get('status', 'pending'),
        user_id=current_user_id
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify(new_task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.due_date = datetime.fromisoformat(data['due_date']) if data.get('due_date') else task.due_date
    task.priority = data.get('priority', task.priority)
    task.status = data.get('status', task.status)
    
    db.session.commit()
    
    return jsonify(task.to_dict()), 200

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted successfully'}), 200

@app.route('/api/tasks/<int:task_id>/status', methods=['PATCH'])
@jwt_required()
def update_task_status(task_id):
    current_user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    task.status = data.get('status', task.status)
    
    db.session.commit()
    
    return jsonify(task.to_dict()), 200

@app.route('/api/tasks/<int:task_id>/subtasks', methods=['POST'])
@jwt_required()
def add_subtask(task_id):
    current_user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    new_subtask = Subtask(
        title=data['title'],
        task_id=task_id
    )
    
    db.session.add(new_subtask)
    db.session.commit()
    
    return jsonify(new_subtask.to_dict()), 201

@app.route('/api/tasks/<int:task_id>/subtasks/<int:subtask_id>', methods=['PUT'])
@jwt_required()
def update_subtask(task_id, subtask_id):
    current_user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    subtask = Subtask.query.filter_by(id=subtask_id, task_id=task_id).first()
    if not subtask:
        return jsonify({'error': 'Subtask not found'}), 404
    
    data = request.get_json()
    subtask.title = data.get('title', subtask.title)
    subtask.completed = data.get('completed', subtask.completed)
    
    db.session.commit()
    
    return jsonify(subtask.to_dict()), 200

@app.route('/api/tasks/<int:task_id>/subtasks/<int:subtask_id>', methods=['DELETE'])
@jwt_required()
def delete_subtask(task_id, subtask_id):
    current_user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    subtask = Subtask.query.filter_by(id=subtask_id, task_id=task_id).first()
    if not subtask:
        return jsonify({'error': 'Subtask not found'}), 404
    
    db.session.delete(subtask)
    db.session.commit()
    
    return jsonify({'message': 'Subtask deleted successfully'}), 200

@app.route('/api/bugs', methods=['POST'])
@jwt_required()
def report_bug():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    try:
        new_bug = Bug(
            title=data['title'],
            description=data['description'],
            steps=data['steps'],
            severity=data['severity'],
            user_id=current_user_id
        )
        
        db.session.add(new_bug)
        db.session.commit()

        # If you want to send an email notification to admins
        admin_email = os.getenv('ADMIN_EMAIL')
        if admin_email:
            msg = Message(
                'New Bug Report',
                recipients=[admin_email],
                body=f'''
A new bug has been reported:

Title: {new_bug.title}
Severity: {new_bug.severity}
Reported by: {new_bug.reporter.name}

Description:
{new_bug.description}

Steps to Reproduce:
{new_bug.steps}

View the full report in the admin dashboard.
'''
            )
            mail.send(msg)

        return jsonify({
            'message': 'Bug report submitted successfully',
            'bug': new_bug.to_dict()
        }), 201

    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/bugs', methods=['GET'])
@jwt_required()
def get_bugs():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    # Only return bugs reported by the current user
    bugs = Bug.query.filter_by(user_id=current_user_id).all()
    return jsonify({
        'bugs': [bug.to_dict() for bug in bugs]
    }), 200

# Add OPTIONS handler for preflight requests
@app.route('/api/request-password-reset', methods=['OPTIONS'])
def handle_preflight():
    response = app.make_default_options_response()
    return response

# Password reset request endpoint
@app.route('/api/request-password-reset', methods=['POST'])
def request_password_reset():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        user = User.query.filter_by(email=email).first()
        
        # For security, don't reveal if user exists
        if not user:
            return jsonify({
                'message': 'If an account exists with this email, you will receive a password reset link'
            }), 200
            
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        
        # Store token in memory (for development/testing)
        if not hasattr(app.config, 'RESET_TOKENS'):
            app.config.RESET_TOKENS = {}
            
        app.config.RESET_TOKENS[reset_token] = {
            'user_id': user.id,
            'expires': datetime.utcnow() + timedelta(hours=1)
        }

        try:
            # Send password reset email
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{frontend_url}/reset-password/{reset_token}"
            
            msg = Message('Reset Your Taskify Password',
                        sender=('Taskify Team', os.getenv('EMAIL_USER')),
                        recipients=[user.email])
            
            msg.body = f'''Hello {user.name},

You have requested to reset your password. Click the link below to set a new password:

{reset_url}

This link will expire in 1 hour. If you did not request a password reset, please ignore this email.

Best regards,
The Taskify Team'''
            
            msg.html = f'''
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff9800;">Reset Your Password</h2>
                <p>Hello {user.name},</p>
                <p>You have requested to reset your password. Click the button below to set a new password:</p>
                <p style="text-align: center;">
                    <a href="{reset_url}" style="background-color: #ff9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Reset Password</a>
                </p>
                <p style="color: #666; font-size: 0.9em;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #ffe0b2; margin: 20px 0;">
                <p style="color: #666; font-size: 0.8em;">Best regards,<br>The Taskify Team</p>
            </div>
            '''
            
            mail.send(msg)
            app.logger.info(f"Password reset email sent to {user.email}")
            
        except Exception as e:
            app.logger.error(f"Failed to send password reset email: {str(e)}")
            # Still return success to not reveal if user exists
            
        return jsonify({
            'message': 'If an account exists with this email, you will receive a password reset link',
            'debug_token': reset_token  # Remove this in production
        }), 200
            
    except Exception as e:
        app.logger.error(f"Password reset request error: {str(e)}")
        return jsonify({'error': 'Failed to process password reset request'}), 500

# Add OPTIONS handler for preflight requests
@app.route('/api/reset-password/<token>', methods=['OPTIONS'])
def handle_reset_password_preflight(token):
    response = app.make_default_options_response()
    return response

# Reset password endpoint
@app.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        # Check if token exists and is valid
        if not hasattr(app.config, 'RESET_TOKENS') or token not in app.config.RESET_TOKENS:
            return jsonify({'error': 'Invalid or expired reset token'}), 400
            
        token_data = app.config.RESET_TOKENS[token]
        
        # Check if token has expired
        if datetime.utcnow() > token_data['expires']:
            del app.config.RESET_TOKENS[token]
            return jsonify({'error': 'Reset token has expired'}), 400
            
        # Get user and new password
        user = User.query.get(token_data['user_id'])
        data = request.get_json()
        new_password = data.get('password')
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if not new_password or len(new_password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
            
        # Update password
        user.password = generate_password_hash(new_password)
        db.session.commit()
        
        # Remove used token
        del app.config.RESET_TOKENS[token]
        
        return jsonify({'message': 'Password reset successfully'}), 200
            
    except Exception as e:
        app.logger.error(f"Password reset error: {str(e)}")
        return jsonify({'error': 'Failed to reset password'}), 500

if __name__ == '__main__':
    app.run(debug=True) 