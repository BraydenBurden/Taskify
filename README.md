# Task Manager Application

A full-stack task management application built with React and Flask. This application allows users to manage tasks, subtasks, and track bugs efficiently.

## Features

- 👤 User Authentication with JWT
- ✉️ Email Verification
- 📝 Task Management (Create, Read, Update, Delete)
- ✅ Subtask Support
- 🐛 Bug Reporting System
- 🎨 User Profile with Customizable Avatar
- 📱 Responsive Design

## Tech Stack

### Frontend

- React
- Material-UI
- React Router
- Axios for API calls

### Backend

- Flask
- SQLite Database
- JWT Authentication
- Flask-Mail for email services

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your configurations
```

5. Run the backend server:

```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Start the development server:

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Environment Variables

### Backend (.env)

- `FLASK_ENV`: development/production
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `FRONTEND_URL`: URL of the frontend application
- `EMAIL_USER`: Gmail address for sending emails
- `EMAIL_PASSWORD`: Gmail app password
- `ADMIN_EMAIL`: Admin email for bug reports

### Frontend (.env)

- `REACT_APP_API_URL`: URL of the backend API
- `REACT_APP_TITLE`: Application title

## API Documentation

### Authentication Endpoints

- `POST /api/signup`: Register a new user
- `POST /api/login`: Login user
- `GET /api/verify-email/<token>`: Verify email
- `POST /api/resend-verification`: Resend verification email

### Task Endpoints

- `GET /api/tasks`: Get all tasks
- `POST /api/tasks`: Create new task
- `PUT /api/tasks/<id>`: Update task
- `DELETE /api/tasks/<id>`: Delete task

### Subtask Endpoints

- `POST /api/tasks/<id>/subtasks`: Add subtask
- `PUT /api/tasks/<id>/subtasks/<subtask_id>`: Update subtask
- `DELETE /api/tasks/<id>/subtasks/<subtask_id>`: Delete subtask

### Bug Report Endpoints

- `POST /api/bugs`: Report a bug
- `GET /api/bugs`: Get all bugs

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
