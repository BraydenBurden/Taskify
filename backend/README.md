# Task Manager Backend

This is the backend server for the Task Manager application, built with Flask and SQLite.

## Setup

1. Install dependencies:

```powershell
pip install -r requirements.txt
```

2. Create a `.env` file with your environment variables:

```
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=development
```

## Running the Server

To run the development server:

```powershell
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user

  - Body: `{ "email": "user@example.com", "password": "password123", "name": "User Name" }`

- `POST /api/auth/login` - Login user

  - Body: `{ "email": "user@example.com", "password": "password123" }`

- `GET /api/auth/user` - Get current user details (requires JWT token)
  - Header: `Authorization: Bearer <token>`

## Database

The application uses SQLite as its database. The database file will be created automatically when you first run the application.
