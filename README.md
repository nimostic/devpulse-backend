# DevPulse API

A role-based Issue Tracking REST API built with Node.js, Express, TypeScript, PostgreSQL, JWT Authentication, and bcrypt.

## Project Information

**Project Name:** DevPulse API

**Live URL:**  https://dev-pulse-sooty-theta.vercel.app

**Repository URL:** https://github.com/nimostic/devpulse-backend

---

## Features

* User Registration (Contributor / Maintainer)
* Secure Authentication using JWT
* Password Hashing with bcrypt
* Create Issues
* Retrieve All Issues with Filtering and Sorting
* Retrieve Single Issue Details
* Update Issues
* Delete Issues
* Role-Based Authorization
* Reporter Information Included in Issue Responses
* PostgreSQL Database Integration
* TypeScript Support
* Structured Error Handling

---

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL

### Authentication & Security

* JWT (JSON Web Token)
* bcrypt

### Utilities

* dotenv
* cors
* http-status-codes

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd devpulse-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build Project

```bash
npm run build
```

### 6. Start Production Server

```bash
npm start
```

---

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/signup
```

#### Login User

```http
POST /api/auth/login
```

---

### Issues

#### Create Issue

```http
POST /api/issues
```

Access:

* Contributor
* Maintainer

---

#### Get All Issues

```http
GET /api/issues
```

Query Parameters:

| Parameter | Values                      |
| --------- | --------------------------- |
| sort      | newest, oldest              |
| type      | bug, feature_request        |
| status    | open, in_progress, resolved |

Example:

```http
GET /api/issues?sort=newest&type=bug&status=open
```

---

#### Get Single Issue

```http
GET /api/issues/:id
```

---

#### Update Issue

```http
PATCH /api/issues/:id
```

Access:

* Maintainer (any issue)
* Contributor (own issue when status is open)

---

#### Delete Issue

```http
DELETE /api/issues/:id
```

Access:

* Maintainer
* Contributor (own issue)

---

## Database Schema Summary

### Users Table

| Column     | Type               |
| ---------- | ------------------ |
| id         | SERIAL PRIMARY KEY |
| name       | VARCHAR(30)        |
| email      | VARCHAR(30) UNIQUE |
| password   | TEXT               |
| role       | VARCHAR(20)        |
| created_at | TIMESTAMP          |
| updated_at | TIMESTAMP          |

Role Values:

* contributor
* maintainer

---

### Issues Table

| Column      | Type               |
| ----------- | ------------------ |
| id          | SERIAL PRIMARY KEY |
| title       | VARCHAR(150)       |
| description | TEXT               |
| type        | VARCHAR(20)        |
| status      | VARCHAR(20)        |
| reporter_id | INT                |
| created_at  | TIMESTAMP          |
| updated_at  | TIMESTAMP          |

Issue Type Values:

* bug
* feature_request

Status Values:

* open
* in_progress
* resolved

---

## Authentication

Protected routes require a JWT token in the Authorization header.

Example:

```http
Authorization: Bearer <your_token>
```

---

## Sample Success Response

```json
{
  "success": true,
  "message": "Issue Retrieved successfully",
  "data": {
    "id": 1,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    }
  }
}
```

---

## Error Handling

The API returns structured error responses.

Example:

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## Author

Abu Nayeem Riyad
