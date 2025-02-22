# Todo App

A full-stack task management application built with React, FastAPI, and MySQL. This application allows users to create, manage, and track tasks with a modern and responsive user interface.

## Features

The application provides essential task management capabilities:

- Create new tasks with title and description
- Display the 5 most recent active tasks
- Mark tasks as completed
- Responsive error handling with modal displays
- Real-time task list updates
- Comprehensive test coverage for both frontend and backend

## Technology Stack

### Frontend
- React.js
- CSS for styling
- Jest and React Testing Library for testing

### Backend
- Python FastAPI
- SQLAlchemy for database operations
- MySQL for data storage
- Pytest for testing

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- Python (v3.10 or higher)
- MySQL (v8.0 or higher)
- Git

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/MalithEdirisinghe/todo-app.git
cd todo-app

2. Frontend Installation:
cd frontend
npm install

3. Backend Configuration:
cd backend
python -m venv venv

# Activate virtual environment
# For Windows:
venv\Scripts\activate
# For Unix or MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

4.Database Setup Access your MySQL command line or management tool and execute:
CREATE DATABASE todos;
```

## Application Deployment
```bash
1. Starting the Backend Server:
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

2. Starting the Frontend Development Server
cd frontend
npm start
```
## Accessing the Application
Frontend Interface: http://localhost:3000

Backend API: http://localhost:8000

API Documentation: http://localhost:8000/docs

## Testing Implementation
Frontend Testing
Execute the following commands in the frontend directory:
```bash
# Run tests
npm test

# Generate coverage report
npm test -- --coverage
```
Backend Testing
Execute the following commands in the backend directory:
```bash
# Run tests with coverage report
pytest --cov=app tests/ --cov-report=term-missing
```
## Docker Deployment

The application supports containerized deployment using Docker and Docker Compose, providing a consistent environment across different platforms.

### Docker Prerequisites
- Docker Engine (version 20.10.0 or later)
- Docker Compose (version 2.0.0 or later)

### Docker Configuration

The application includes three main services:
1. Frontend React application
2. Backend FastAPI service
3. MySQL database

Each service has its own Dockerfile and configuration:

#### Frontend Dockerfile (frontend/Dockerfile)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### Backend Dockerfile (backend/Dockerfile)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

#### Docker Compose Configuration (docker-compose.yml)
```dockerfile
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=mysql+pymysql://root@db:3306/todos
    depends_on:
      - db
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ALLOW_EMPTY_PASSWORD=yes
      - MYSQL_DATABASE=todos
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  mysql_data:
  ```

  ## Running with Docker
### Build and start all services:
```bash
docker-compose up --build
```
### Stop and remove containers:
```bash
docker-compose down
```