# Task Management & Project Tracking API

A RESTful backend API for managing users, projects, and tasks.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected project and task APIs
- Project CRUD operations
- Project-owner authorization
- Task CRUD operations
- Optional task assignment to users
- Task status: `TODO`, `IN_PROGRESS`, `COMPLETED`
- Task priority: `LOW`, `MEDIUM`, `HIGH`
- Due dates
- Automatic created and updated timestamps
- PostgreSQL database with Prisma ORM

## Tech Stack

- Node.js
- Express.js
- PostgreSQL / Supabase
- Prisma ORM
- JWT
- bcrypt
- Postman

## Project Structure

```text
task-management/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   └── task.routes.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Install the following:

- Node.js
- PostgreSQL database or Supabase PostgreSQL
- npm
- Postman

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd task-management
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="YOUR_DATABASE_URL"
DIRECT_URL="YOUR_DIRECT_DATABASE_URL"
JWT_SECRET="YOUR_JWT_SECRET"
PORT=5000
```

Do not commit `.env` or expose database credentials and JWT secrets.

## Database Setup

Validate the Prisma schema:

```bash
npx prisma validate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Apply the database schema:

```bash
npx prisma migrate dev
```

## Run the Server

Start the development server:

```bash
npm run dev
```

Or:

```bash
node src/server.js
```

The API runs at:

```text
http://localhost:5000
```

## Health Check

**GET**

```text
http://localhost:5000/
```

Expected response:

```json
{
  "message": "Task management API is running"
}
```

# API Documentation

## 1. Authentication

### Register

**POST**

```text
http://localhost:5000/api/auth/register
```

Postman:

**Body → raw → JSON**

```json
{
  "name": "Raj",
  "email": "raj@test.com",
  "password": "password123"
}
```

Expected status:

```text
201 Created
```

Expected response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Raj",
    "email": "raj@test.com"
  }
}
```

### Login

**POST**

```text
http://localhost:5000/api/auth/login
```

Body:

```json
{
  "email": "raj@test.com",
  "password": "password123"
}
```

Expected status:

```text
200 OK
```

Response:

```json
{
  "message": "Login successful",
  "token": "YOUR_JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Raj",
    "email": "raj@test.com"
  }
}
```

Copy the JWT token. It is required for protected project and task endpoints.

---

# 2. Project Management

All project endpoints require authentication.

In Postman:

**Authorization → Bearer Token → paste your JWT token**

### Create Project

**POST**

```text
http://localhost:5000/api/projects
```

Body:

```json
{
  "title": "Task Management API",
  "description": "Backend assessment project"
}
```

### Get All Projects

**GET**

```text
http://localhost:5000/api/projects
```

### Get Project by ID

**GET**

```text
http://localhost:5000/api/projects/1
```

Replace `1` with the actual project ID.

### Update Project

**PUT**

```text
http://localhost:5000/api/projects/1
```

Body:

```json
{
  "title": "Updated Task Management API",
  "description": "Updated project description"
}
```

### Delete Project

**DELETE**

```text
http://localhost:5000/api/projects/1
```

Replace `1` with the actual project ID.

Only the project owner can update or delete the project.

---

# 3. Task Management

All task endpoints require authentication.

### Create Task

**POST**

```text
http://localhost:5000/api/projects/1/tasks
```

Replace `1` with the project ID.

Body:

```json
{
  "title": "Implement authentication",
  "description": "Implement JWT authentication",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-10-05"
}
```

### Create Task with Assigned User

```json
{
  "title": "Implement authentication",
  "description": "Implement JWT authentication",
  "assignedUserId": 2,
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-10-05"
}
```

`assignedUserId` is optional.

### Get Project Tasks

**GET**

```text
http://localhost:5000/api/projects/1/tasks
```

### Get Task by ID

**GET**

```text
http://localhost:5000/api/tasks/1
```

### Update Task

**PUT**

```text
http://localhost:5000/api/tasks/1
```

Body:

```json
{
  "title": "Implement JWT authentication",
  "description": "Authentication implementation in progress",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-10-05"
}
```

### Allowed Status Values

```text
TODO
IN_PROGRESS
COMPLETED
```

### Allowed Priority Values

```text
LOW
MEDIUM
HIGH
```

### Delete Task

**DELETE**

```text
http://localhost:5000/api/tasks/1
```

Replace `1` with the actual task ID.

---

# Postman Testing Order

For a complete test, use this order:

```text
1. Register
       ↓
2. Login
       ↓
3. Copy JWT token
       ↓
4. Create Project
       ↓
5. Get All Projects
       ↓
6. Get Project by ID
       ↓
7. Update Project
       ↓
8. Create Task
       ↓
9. Get Project Tasks
       ↓
10. Get Task by ID
       ↓
11. Update Task
       ↓
12. Delete Task
       ↓
13. Delete Project
```

For every protected request:

```text
Postman
→ Authorization
→ Bearer Token
→ Paste JWT token
```

---

# Authentication Flow

```text
Register
   ↓
Password hashed with bcrypt
   ↓
User stored in PostgreSQL
   ↓
Login
   ↓
Password verified
   ↓
JWT generated
   ↓
Client sends JWT with protected requests
   ↓
Authentication middleware verifies JWT
   ↓
Protected controller executes
```

# Database Models

## User

- id
- name
- email
- password
- createdAt
- updatedAt

## Project

- id
- title
- description
- ownerId
- createdAt
- updatedAt

## Task

- id
- title
- description
- projectId
- assignedUserId (optional)
- status
- priority
- dueDate
- createdAt
- updatedAt

# Security

- Passwords are hashed before storage.
- Passwords are not returned in API responses.
- Protected APIs require a valid JWT.
- Project update/delete operations verify project ownership.
- Database credentials and JWT secrets are stored in environment variables.

# API Summary

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/projects` | Yes |
| GET | `/api/projects` | Yes |
| GET | `/api/projects/:id` | Yes |
| PUT | `/api/projects/:id` | Yes |
| DELETE | `/api/projects/:id` | Yes |
| POST | `/api/projects/:projectId/tasks` | Yes |
| GET | `/api/projects/:projectId/tasks` | Yes |
| GET | `/api/tasks/:id` | Yes |
| PUT | `/api/tasks/:id` | Yes |
| DELETE | `/api/tasks/:id` | Yes |

## License

This project was developed as part of a backend development assessment.